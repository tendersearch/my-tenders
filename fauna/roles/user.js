const{ query } = require("faunadb");
const{ Collection, Function: Func, Index } = query;
const userOwnerRead = require("../predicates/userOwnerRead");
const userOwnerWrite = require("../predicates/userOwnerWrite");

module.exports = {
	name: "User",
	privileges: [
		{
			resource: Collection("User"),
			actions: {
				read: userOwnerRead,
				write: userOwnerWrite,
				create: false,
				delete: false,
				history_read: false,
				history_write: false,
				unrestricted_read: false,
				call: false
			}
		},
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
			resource: Func("current_user"),
			actions: {
				call: true
			}
		},
		{
			resource: Func("search_tender"),
			actions: {
				call: true
			}
		},
		{
			resource: Func("create_admin_user"),
			actions: {
				call: true
			}
		},
		{
			resource: Index("userByRole"),
			actions: {
				unrestricted_read: false,
				read: true
			}
		}
	],
	membership: [
		{
			resource: Collection("User")
		}
	]
};
