import Layout from "../components/Layout/Layout";
import Result from "../components/Result/Result";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useRouter } from "next/router";

// Semantic ui
import { Loader } from "semantic-ui-react";

// Styles
import styles from "../styles/saved.module.css";
import { useEffect, useContext } from "react";
import UserContext from "../contexts/userContext";

const USERS_TENDERS = gql`
query($id: ID!){
	findUserByID(id: $id){
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
				url
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
	if(typeof window === "undefined") return"";
	const user = useContext(UserContext);
	const router = useRouter();

	if(!user.loggedIn) {
		router.replace("/");
		return"";
	};

	const{ loading, error, data } = useQuery(USERS_TENDERS, {
		variables: { id: user._id },
		fetchPolicy: "cache-and-network"
	});

	const allTenders = typeof data !== "undefined"
		? data.findUserByID.savedTenders.data
		: (user ? user.savedTenders.data : []);
	const tenders = allTenders.filter( tender => user.savedTenders.data.map( t => t._id).includes(tender._id));

	useEffect( () => {
		if(error)
			console.error(error);
	});

	if(loading)
		return<Loader active />;

	if(error)
		return(
			<div className={styles.error}>
				An error occured when trying to load your tenders.
			</div>
		);

	if(tenders.length === 0)
		return(
			<div className={styles.error}>
				You do not have any saved tenders. <br /> <br />
				If you have saved tenders in the past, this probably means that they have been completely remove from the site. Sorry about that :(
			</div>
		);

	if(tenders.length > 0)
		return(
			<div className={styles.tenders}>
				<p className={styles.info}>If you can&apos;t see a tender that you&apos;ve previously saved, it has probably been removed from the site.</p>
				{
					tenders.map( tender => (
						<Result
							{...tender}
							key={tender._id}
							id={tender._id}
							fromSaved={true}
						/>
					))
				}
			</div>
		);
}
