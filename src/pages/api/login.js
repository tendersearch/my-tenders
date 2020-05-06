const { OAuth2Client } = require("google-auth-library");
const ApolloClient = require("apollo-boost").default;
const gql = require("graphql-tag");
const response = require("../../util/api/response").default;
require("isomorphic-fetch");

const google = new OAuth2Client(process.env.GOOGLE_API_KEY);
const client = new ApolloClient({
	uri: "https://graphql.fauna.com/graphql",
	fetch,
	headers: {
		"Authorization": `Bearer ${process.env.FAUNADB_SERVER_KEY}`
	}
});

const USER_EXISTS = gql`
query($userId: String!){
	userExists(userId: $userId)
}
`

const LOGIN_USER = gql`
mutation($userId: String!){
	loginUser(input: {
		userId: $userId
	})
}
`

const CREATE_USER = gql`
mutation($name: String!, $email: String!, $userId: String!){
	createUser(input: {
		name: $name
		email: $email
		userId: $userId
	}){
		userId
	}
}
`

export default async (req, res) => {
	if(req.method !== "POST") return response(404, { message: "Not found" }, res);
	
	// Read body
	const body = req.body;
	const { tokenId, accessToken } = body;

	// Return error if the required fields are not present.
	if(!tokenId || !accessToken) return response(400, { message: "Missing tokenId or accessToken" }, res);

	// Verify the token
	const result = await verifyToken(tokenId);
	if(!result) return response(400, { message: "Invalid token" }, res);

	// Get profile info
	const { email, name, sub: userId } = result;

	// Check if the user trying to log in has an account or not.
	const userExistsResult = await client.query({ query: USER_EXISTS, variables: { userId } });
	const userExists = userExistsResult.data.userExists;

	// Login the user if they exist, or create the user if they don't exist.
	if(userExists) return loginUser({ userId }, res);
	if(!userExists) return createUser({ email, name, userId }, res);
		
	return response(200, { 
		message: "Success",
		name,
		email,
		userId
	}, res);
}

async function verifyToken(token){
	try{
		const ticket = await google.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID
		});
	
		return ticket.getPayload();
	}catch(err){
		return null;
	}
}

async function loginUser(data, res){
	// Send login request
	const loginUserResult = await client.mutate({ mutation: LOGIN_USER, variables: data });
	const { errors, data: result } = loginUserResult;

	// Handle errors
	if(errors){
		console.log("Login user errors:", errors);

		if(errorIsPresent("instance not found", errors))
			return response(404, { message: "Could not find user" }, res);

		throw errors;
	}

	// Return the response with the secret
	const secret = result.loginUser;
	response(200, { message: "Success! User logged in.", secret }, res)
}

async function createUser(data, res){
	// Send request to create user.
	const createUserResult = await client.mutate({ mutation: CREATE_USER, variables: data });
	const { errors, data: result } = createUserResult;

	// Handle errors
	if(errors){
		console.log("Create user errors:", errors);

		if(errorIsPresent("instance not unique", errors)) 
			return response(409, { message: "User already exists"}, res);

		if(errorIsPresent("transaction aborted", errors))
			return response(500, { message: "Service Error" }, res);

		throw errors;
	}

	await loginUser(result.createUser, res);
}

/**
 * Check if a specific error exists within an error response from FaunaDB GraphQL.
 * @param {String}  error - The error to find.
 * @param {Array} errorsArray - An array of errors returned from FaunaDB GraphQL.
 */
function errorIsPresent(error, errorsArray){
	return [...errorsArray].some( item => item.extensions.code === error);
}