const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_estAmount_desc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "estAmount"], reverse: true },
		{ field: ["ref"] }
	]
}