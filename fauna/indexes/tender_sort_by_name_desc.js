const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_name_desc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "name"], reverse: true },
		{ field: ["ref"] }
	]
}