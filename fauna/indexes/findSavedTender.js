const{ query: q } = require("faunadb");

module.exports = {
	name: "findSavedTender",
	source: q.Collection("tender_savedBy"),
	terms: [
		{ field: ["data", "tenderID"] }
	],
	values: [
		{ field: ["ref"] }
	]
};
