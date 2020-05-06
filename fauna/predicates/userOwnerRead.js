const { query } = require("faunadb");
const { Query, Lambda, Identity, Equals, Var } = query;

module.exports = Query(
	Lambda(
		"ref",
		Equals(
			Identity(),
			Var("ref")
		)
	)
);