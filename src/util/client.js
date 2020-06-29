import ApolloClient from "apollo-boost";
import Cookie from "js-cookie";
import "isomorphic-fetch";

const GUEST_KEY = process.env.FAUNADB_GUEST_KEY;

const client = new ApolloClient({
	uri: "https://graphql.fauna.com/graphql",
	fetch,
	request: operation => {
		const secret = Cookie.get("secret");
		operation.setContext({
			headers: {
				"Authorization": `Bearer ${secret || GUEST_KEY}`,
				"X-Schema-Preview": "partial-update-mutation"
			}
		});
	}
});

export default client;
