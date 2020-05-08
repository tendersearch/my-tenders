const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "tender_sort_by_estAmount_asc",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "estAmount"] },
		{ field: ["ref"] }
	]
}