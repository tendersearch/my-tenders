const response = require("../../../util/api/response").default;
const algoliasearch = require("algoliasearch");
const ApolloClient = require("apollo-boost").default;
const faunadb = require("faunadb");
const getUserRole = require("../../../util/api/getUserRole");
require("isomorphic-fetch");

module.exports = async (req, res) => {
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

	await clearTendersFromDB();
	await clearTendersFromAlgolia();

	response(200, { message: "Tenders cleared" }, res);
};

async function clearTendersFromDB(){
	const client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_KEY
	});
	const q = faunadb.query;

	await client.query(
		q.Map(
			q.Paginate(
				q.Documents(q.Collection("Tender")),
				{ size: 100000 }
			),
			q.Lambda(
				"item",
				q.Delete(q.Var("item"))
			)
		)
	);
}

async function clearTendersFromAlgolia(){
	const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
	const index = client.initIndex("tender");
	await index.clearObjects();
}
