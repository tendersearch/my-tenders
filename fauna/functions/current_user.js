const{ query } = require("faunadb");
const{ Query, Lambda, Identity, Get } = query;

module.exports = {
	name: "current_user",
	body:
	Query(
		Lambda(
			[],
			Get(Identity())
		)
	)
};
