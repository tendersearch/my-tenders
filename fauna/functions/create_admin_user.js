const { query } = require("faunadb");
const { Query, Lambda, Create, Collection, Select, Var } = query;

module.exports = {
	name: "create_admin_user",
	role: "admin",
	body: 
	Query(
		Lambda(
			["input"],
			Create(Collection("User"), {
				data: {
					name: Select("name", Var("input")),
					email: Select("email", Var("input")),
					userId: Select("userId", Var("input")),
					role: "ADMIN"
				}
			})
		)
	)
}