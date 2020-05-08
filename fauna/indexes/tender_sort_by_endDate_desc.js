const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_endDate_desc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "endDate"], reverse: true },
		{ field: ["ref"] }
	]
}