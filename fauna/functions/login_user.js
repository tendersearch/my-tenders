const{ query } = require("faunadb");
const{ Query, Lambda, Create, Tokens, Select, Get, Var, Match, Index } = query;

module.exports = {
	name: "login_user",
	role: "admin",
	body:
	Query(
		Lambda(
			["input"],
			Select("secret",
				Create( Tokens(), {
					instance: Select(
						"ref",
						Get( Match( Index("unique_User_userId"), Select("userId", Var("input")) ) )
					)
				})
			)
		)
	)
};
