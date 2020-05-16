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
			resource: Collection("tender_savedBy"),
			actions: {
				read: true,
				write: true,
				create: true,
				delete: true
			}
		},
		{
			resource: Func("current_user"),
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
			resource: Func("logout"),
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
		},
		{
			resource: Index("tender_savedBy_by_tender"),
			actions: {
				read: true
			}
		},
		{
			resource: Index("tender_savedBy_by_user"),
			actions: {
				read: true
			}
		},
		{
			resource: Index("tender_savedBy_by_tender_and_user"),
			actions: {
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
