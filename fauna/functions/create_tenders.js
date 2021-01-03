const{ query } = require("faunadb");
const{ Query, Lambda, Var, Create, Collection, Map: FMap,
	If, Index, Match, Select, Exists, Update, Let, Get } = query;

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
								Index("unique_Tender_rowId"),
								Select(["rowId"], Var("tender"))
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
