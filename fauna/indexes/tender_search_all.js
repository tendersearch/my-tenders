const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_search_all",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "name"] },
		{ field: ["data", "description"] },
		{ field: ["data", "state"] },
		{ field: ["data", "city"] },
		{ field: ["ref"] }
	]
}