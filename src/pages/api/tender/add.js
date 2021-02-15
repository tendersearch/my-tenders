const response = require("../../../util/api/response").default;
const algoliasearch = require("algoliasearch");
const ApolloClient = require("apollo-boost").default;
const faunadb = require("faunadb");
const getUserRole = require("../../../util/api/getUserRole");
require("isomorphic-fetch");

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

	if(role !== "ADMIN") return response(401, "Not authorized", res);

	const shouldBuild = req.headers["x-trigger-build"];
	const body = parseBody(req.body);
	const result = await createTenders(body, db);

	const tenders = result.map( item => {
		const openingDate = item.data.openingDate.toString().replace(/(Time|\(|\)|")/g, "");
		const endDate = item.data.endDate.toString().replace(/(Time|\(|\)|")/g, "");

		return{
			...item.data,
			objectID: item.id,
			openingDate,
			endDate,
			opening_timestamp: new Date(openingDate).getTime(),
			end_timestamp: new Date(endDate).getTime()
		};
	});
	await saveToAlgolia(tenders);

	if(shouldBuild === "build")
		await triggerBuildHook();

	response(200, { message: "Tenders saved!" }, res);
};

async function triggerBuildHook(){
	const hook = process.env.ADD_TENDER_HOOK;
	if(!hook) throw Error("No deploy hook found, cannot trigger new build.");

	const response = await fetch(hook, { method: "POST" });
	const result = await response.json();

	console.log(result);
};

async function createTenders(data){
	const client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_KEY
	});
	const q = faunadb.query;

	// Use FQL because the graphql api wouldn't let me create multiple entries at once.
	const result = await client.query(
		q.Map(
			q.Call(q.Function("create_tenders"),
				q.Map(
					data,
					q.Lambda(
						"item",
						{
							rowId: q.Select(["rowId"], q.Var("item")),
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

function parseBody(input){
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

async function saveToAlgolia(objects){
	try{
		const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
		const index = client.initIndex("tender");
		index.setSettings({
			searchableAttributes: [
				"name",
				"description",
				"city",
				"state"
			],
			attributesForFaceting: [
				"name",
				"city",
				"state",
				"department"
			]
		});

		const result = await index.saveObjects(objects);
		const count = result.objectIDs.length;
		console.log("Indexed " + count + " objects...");
	}catch(err){
		throw err;
	}
};
