const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_search_by_state",
	source: Collection("Tender"),
	terms: [
		{ field: ["data", "state"] }
	]
}