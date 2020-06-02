const gql = require("graphql-tag");

const CURRENT_USER = gql`
query{
	currentUser{
		role
	}
}
`;

const getUserRole = async (client) => {
	const result = await client.query({ query: CURRENT_USER });
	const role = result.data.currentUser.role;

	return role;
};

module.exports = getUserRole;
