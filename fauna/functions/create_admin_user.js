const{ query } = require("faunadb");
const{ Query, Lambda, Exists, Update, If, Match, Index, Identity, Do, Not } = query;

module.exports = {
	name: "create_admin_user",
	role: "server",
	body:
	Query(
		Lambda(
			[],
			If(
				Not(Exists(Match(Index("userByRole"), "ADMIN"))),
				Do(
					// Update the users role and return true if no admin exists.
					Update(Identity(), { data: { role: "ADMIN" } }),
					true
				),
				// return false if an admin exists already
				false
			)
		)
	)
};
