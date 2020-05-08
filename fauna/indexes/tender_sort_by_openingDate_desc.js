const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_openingDate_desc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "openingDate"], reverse: true },
		{ field: ["ref"] }
	]
}