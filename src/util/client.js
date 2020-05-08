import ApolloClient from "apollo-boost";
import Cookie from "js-cookie";

const GUEST_KEY = process.env.FAUNADB_GUEST_KEY;

const client = new ApolloClient({
	uri: "https://graphql.fauna.com/graphql",
	fetch,
	request: operation => {
		operation.setContext({
			headers: {
				"Authorization": `Bearer ${Cookie.get("secret") ? Cookie.get("secret") : GUEST_KEY}`,
				"X-Schema-Preview": "partial-update-mutation"
			}
		});
	}
});

export default client;
