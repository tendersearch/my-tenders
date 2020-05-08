const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_search_by_description",
	source: Collection("Tender"),
	terms: [
		{ field: ["data", "description"] }
	]
}