const{ query } = require("faunadb");
const{ Collection, Query, Lambda, LowerCase, Select, Var } = query;

module.exports = {
	name: "tender_search_by_name",
	source: {
		collection: Collection("Tender"),
		fields: {
			lowercase: Query(
				Lambda(
					"doc",
					LowerCase(Select(["data", "name"], Var("doc")))
				)
			)
		}
	},
	terms: [
		{ binding: "lowercase" }
	],
	values: [
		{ binding: "lowercase" },
		{ field: ["data", "name"] },
		{ field: ["ref"] }
	]
};
