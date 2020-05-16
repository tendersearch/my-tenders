const{ query } = require("faunadb");
const{ Query, Lambda, Logout, Role } = query;

module.exports = {
	name: "logout",
	role: Role("User"),
	body:
	Query(
		Lambda(
			"",
			Logout(false)
		)
	)
};
