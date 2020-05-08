const{ query } = require("faunadb");
const{ Query, Lambda, Filter, Paginate, Documents, Collection, Or, ContainsStrRegex, Get, Var, Map: FMap, Select, Concat, Role } = query;

module.exports = {
	name: "search_tender",
	role: Role("User"),
	body:
	Query(
		Lambda(
			["query", "size", "after"],
			Select(["date"],
				FMap(
					Filter(
						Paginate(Documents(Collection("Tender")), { size: Var("size"), after: Var("after") }),
						Lambda(
							"item",
							Or(
								ContainsStrRegex(Select(["data", "name"], Get(Var("item"))), Concat([".*", Var("query"), ".*"])),
								ContainsStrRegex(Select(["data", "description"], Get(Var("item"))), Concat([".*", Var("query"), ".*"])),
								ContainsStrRegex(Select(["data", "state"], Get(Var("item"))), Concat([".*", Var("query"), ".*"])),
								ContainsStrRegex(Select(["data", "city"], Get(Var("item"))), Concat([".*", Var("query"), ".*"]))
							)
						)
					),
					Lambda(
						["item"],
						Select(["data"], Get(Var("item")))
					)
				)
			)
		)
	)
};

/*
TODO:

Create a custom index for allTender and search through the index values.
I could use a Filter to remove every result which does not match,
and the use Count GTE 0 to check if one of the indexes match the search query.
*/
