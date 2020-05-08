const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_name_asc",
	source: Collection("Tender"),
	terms: [
		{ field: ["ref"] }
	],
	values: [
		{ field: ["data", "name"] },
		{ field: ["ref"] }
	]
	
}