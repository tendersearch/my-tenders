const{ query } = require("faunadb");
const{ Query, Lambda, Update, If, Equals, Count, Match, Index, Identity, Select, Get, Do } = query;

module.exports = {
	name: "create_admin_user",
	role: null,
	body:
	Query(
		Lambda(
			[],
			If(
				Equals(Count(Match(Index("userByRole"), "ADMIN")), 0),
				Do(
					Update(Identity(),
						{
							data: { role: "ADMIN" }
						}
					),
					Equals(Select(["data", "role"], Get(Identity())), "ADMIN")
				),
				false
			)
		)
	)
};
