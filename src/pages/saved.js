import Layout from "../components/Layout/Layout";
import Result from "../components/Result/Result";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Loader } from "semantic-ui-react";

// Styles
import styles from "../styles/saved.module.css";
import { useEffect } from "react";

const USERS_TENDERS = gql`
query{
	currentUser{
		savedTenders{
			data{
				name
				description
				state
				city
				emd
				endDate
				openingDate
				estAmount
				_id
			}
		}
	}
}
`;

export default function saved(){
	return(
		<Layout
			title="Saved tenders"
		>
			<div className={styles.container}>
				<h1>Saved tenders</h1>
				<SavedTenders />
			</div>
		</Layout>
	);
}

function SavedTenders(){
	const{ loading, error, data } = useQuery(USERS_TENDERS);
	const tenders = data ? data.currentUser.savedTenders.data : [];

	console.log(tenders);

	useEffect( () => {
		if(error)
			console.error(error);
	});

	if(loading)
		return<Loader active />;

	if(error)
		return(
			<div className={error}>
				An error occured when trying to load your tenders.
			</div>
		);

	if(tenders.length === 0)
		return(
			<div className={error}>
				You do not have any saved tenders
			</div>
		);

	if(tenders.length > 0)
		return(
			<div className={styles.tenders}>
				{
					tenders.map( tender => (
						<Result
							{...tender}
							key={tender._id}
							id={tender._id}
						/>
					))
				}
			</div>
		);
}
