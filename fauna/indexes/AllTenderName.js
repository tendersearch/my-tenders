const{ query } = require("faunadb");
const{ Collection } = query;

module.exports = {
	name: "allTenderName",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "name"] }
	]
};
