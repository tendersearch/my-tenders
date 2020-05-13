const{ query } = require("faunadb");
const{ Collection } = query;

module.exports = {
	name: "allTenderState",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "state"] }
	]
};
