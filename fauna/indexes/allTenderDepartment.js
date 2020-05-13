const{ query } = require("faunadb");
const{ Collection } = query;

module.exports = {
	name: "allTenderDepartment",
	source: Collection("Tender"),
	values: [
		{ field: ["data", "department"] }
	]
};
