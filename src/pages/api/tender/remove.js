const response = require("../../../util/api/response").default;
const algoliasearch = require("algoliasearch");
const ApolloClient = require("apollo-boost").default;
const faunadb = require("faunadb");
const getUserRole = require("../../../util/api/getUserRole");
require("isomorphic-fetch");

module.exports = async (req, res) => {
	try{
		if(req.method !== "DELETE") return response(404, "Endpoint not found", res);

		const authorization = req.headers["authorization"];
		if(!authorization) return response(400, "No Authentication provided", res);

		const db = new ApolloClient({
			uri: "https://graphql.fauna.com/graphql",
			fetch,
			headers: {
				"Authorization": `${authorization}`
			}
		});
		const role = await getUserRole(db);

		if(role !== "ADMIN") return response(401, "Not authorized", res);

		const ids = req.body;
		const dbResult = await removeFromDB(ids);
		const algoliaResult = await removeFromAlgolia(dbResult);

		console.log("DB result:", dbResult);
		console.log("Algolia result:", algoliaResult);

		return response(200, "Removed", res);
	}catch(err){
		console.error(err);

		return response(500, "Internal Server Error", res);
	}
};

async function removeFromDB(ids){
	const client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_KEY
	});
	const q = faunadb.query;

	const result = await client.query(
		q.Foreach(ids,
			q.Lambda(
				"id",
				q.Delete( q.Ref(q.Collection("Tender"), q.Var("id")) )
			)
		)
	);

	return result;
}

async function removeFromAlgolia(ids){
	const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
	const index = client.initIndex("tender");
	const result = await index.deleteObjects(ids);

	return result;
}
