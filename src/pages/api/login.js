const{ OAuth2Client } = require("google-auth-library");
const ApolloClient = require("apollo-boost").default;
const gql = require("graphql-tag");
const response = require("../../util/api/response").default;
const gqlErrors = require("../../util/api/gqlErrors");
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
`;

const LOGIN_USER = gql`
mutation($userId: String!){
	loginUser(input: {
		userId: $userId
	})
}
`;

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
`;

export default async (req, res) => {
	if(req.method !== "POST") return response(404, { message: "Not found" }, res);

	// Read body
	const body = req.body;
	const{ tokenId } = body;

	// Return error if the required fields are not present.
	if(!tokenId) return response(400, { message: "Missing tokenId" }, res);

	// Verify the token
	const result = await verifyToken(tokenId);
	if(!result) return response(400, { message: "Invalid token" }, res);

	// Get profile info
	const{ email, name, sub: userId } = result;

	// Check if the user trying to log in has an account or not.
	const userExistsResult = await client.query({ query: USER_EXISTS, variables: { userId } });
	const{ errors, data } = userExistsResult;
	if(errors) return gqlErrors(errors, res);

	const userExists = data.userExists;

	// Login the user if they exist. Create the user if they don't exist.
	if(userExists) return loginUser({ userId }, res);
	if(!userExists) return createUser({ email, name, userId }, res);
};

/**
 * Verify token returned from Google sign in
 * @param {String} token - The string to verify.
 */
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

/**
 * Login a user by their userId
 * @param {Object} data - The data to use for login
 * @param {String} data.userId - The userId to login
 * @param {Response} res - A response object.
 */
async function loginUser(data, res){
	// Send login request
	const loginUserResult = await client.mutate({ mutation: LOGIN_USER, variables: data });
	const{ errors, data: result } = loginUserResult;

	// Handle errors
	if(errors) return gqlErrors(errors, "User", res);

	// Return the response with the secret
	const secret = result.loginUser;
	response(200, { message: "Success! User logged in.", secret }, res);
}

/**
 * Create a user
 * @param {Object} data - The data to use for creating the user
 * @param {String} data.name - The user's name
 * @param {String} data.email - The user's email
 * @param {String} data.userId - The user's google id
 * @param {Response} res - A response object
 */
async function createUser(data, res){
	// Send request to create user.
	const createUserResult = await client.mutate({ mutation: CREATE_USER, variables: data });
	const{ errors, data: result } = createUserResult;

	// Handle errors
	if(errors) return gqlErrors(errors, "User", res);

	// Login if everything went okay.
	await loginUser(result.createUser, res);
}
