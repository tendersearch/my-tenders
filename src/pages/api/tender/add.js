const response = require("../../../util/api/response").default;
const algoliasearch = require("algoliasearch");
const gql = require("graphql-tag");
const ApolloClient = require("apollo-boost").default;
const faunadb = require("faunadb");
require("isomorphic-fetch");

const CURRENT_USER = gql`
query{
	currentUser{
		role
	}
}
`;

module.exports = async (req, res) => {
	if(req.method !== "POST") return response(404, "Endpoint not found", res);
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

	if(role !== "ADMIN") return response(403, "Access denied");

	const body = parseBody(req.body);
	const result = await createTenders(body, db);

	const tenders = result.map( item => ({
		...item.data,
		objectID: item.id,
		opening_timestamp: new Date(item.data.openingDate).getTime(),
		end_timestamp: new Date(item.data.endDate).getTime()
	}));
	await saveToAlgolia(tenders);

	response(200, { message: "Tenders saved!" }, res);
};

const getUserRole = async (client) => {
	const result = await client.query({ query: CURRENT_USER });
	const role = result.data.currentUser.role;

	return role;
};

const createTenders = async (data) => {
	const client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_KEY
	});
	const q = faunadb.query;

	console.log(data);

	// Use FQL because the graphql api wouldn't let me create multiple entries at once.
	const result = await client.query(
		q.Map(
			q.Call(q.Function("create_tenders"),
				q.Map(
					data,
					q.Lambda(
						"item",
						{
							name: q.Select(["name"], q.Var("item")),
							department: q.Select(["department"], q.Var("item")),
							state: q.Select(["state"], q.Var("item")),
							city: q.Select(["city"], q.Var("item")),
							description: q.Select(["description"], q.Var("item")),
							estAmount: q.Select(["estAmount"], q.Var("item")),
							emd: q.Select(["emd"], q.Var("item")),
							url: q.Select(["url"], q.Var("item")),
							endDate: q.ToTime(q.Select(["endDate"], q.Var("item"))),
							openingDate: q.ToTime(q.Select(["openingDate"], q.Var("item")))
						}
					)
				)
			),
			q.Lambda(
				"item",
				{
					id: q.Select(["ref", "id"], q.Var("item")),
					data: q.Select(["data"], q.Var("item"))
				}
			)
		)
	);

	return result;
};

const parseBody = (input) => {
	return input.map( tender => {
		return{
			...tender,
			emd: parseInt(tender.emd),
			estAmount: parseInt(tender.estAmount),
			openingDate: new Date(tender.openingDate).toISOString(),
			endDate: new Date(tender.endDate).toISOString()
		};
	});
};

const saveToAlgolia = async (objects) => {
	try{
		const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
		const index = client.initIndex("tender");
		index.setSettings({
			searchableAttributes: [
				"name",
				"description",
				"city",
				"state"
			]
		});

		const result = await index.saveObjects(objects);
		return result;
	}catch(err){
		throw err;
	}
};
