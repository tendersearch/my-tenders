const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_openingDate_asc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "openingDate"] },
		{ field: ["ref"] }
	]
}