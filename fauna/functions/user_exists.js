const { query } = require("faunadb");
const { Query, Lambda, Var, Exists, Index, Match } = query;

module.exports = {
	name: "user_exists",
	body: 
	Query(
		Lambda(
			["userId"],
			Exists(
				Match(Index("unique_User_userId"), Var("userId"))
			)
		)
	)
}