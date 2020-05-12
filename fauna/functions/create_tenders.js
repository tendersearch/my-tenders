const{ query } = require("faunadb");
const{ Query, Lambda, Var, Create, Collection, Map: FMap,
	If, Index, Match, Select, LowerCase, Exists, Update, Let, Get } = query;

module.exports = {
	name: "create_tenders",
	role: "admin",
	body:
	Query(
		Lambda(
			"tenders",
			FMap(
				Var("tenders"),
				Lambda(
					"tender",
					Let(
						{ ref:
							Match(
								Index("tender_search_by_name"),
								LowerCase(Select(["name"], Var("tender")))
							)
						},
						If(
							Exists(
								Var("ref")
							),
							Update(Select(["ref"], Get(Var("ref"))), { data: Var("tender") }),
							Create(Collection("Tender"), { data: Var("tender") })
						)
					)
				)
			)
		)
	)
};
