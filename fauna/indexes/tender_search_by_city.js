const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_search_by_city",
	source: Collection("Tender"),
	terms: [
		{ field: ["data", "city"] }
	]
}