const { query } = require("faunadb");
const { Collection } = query;

module.exports = {
	name: "Guest",
	privileges: [
		{
			resource: Collection("Tender"),
			actions: {
				read: true,
				write: false,
				create: false,
				delete: false,
				history_read: false,
				history_write: false,
				unrestricted_read: false,
				call: false
			}
		},
		{
			resource: Collection("User"),
			actions: {
				read: false,
				write: false,
				create: false,
				delete: false,
				history_read: false,
				history_write: false,
				unrestricted_read: false,
				call: false
			}
		}
		
	]
}