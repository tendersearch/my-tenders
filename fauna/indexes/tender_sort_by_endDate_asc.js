const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_endDate_asc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "endDate"] },
		{ field: ["ref"] }
	]
}