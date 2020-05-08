const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_emd_asc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "emd"] },
		{ field: ["ref"] }
	]
}