const{ query } = require("faunadb");
const{ Collection } = query;

module.exports = {
	name: "allTenderCity",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "city"] }
	]
};
