import Layout from "../components/Layout/Layout";
import Result from "../components/Result/Result";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useRouter } from "next/router";

// Semantic ui
import { Loader, Modal, Button } from "semantic-ui-react";

// Styles
import styles from "../styles/saved.module.css";
import { useEffect, useContext, useState } from "react";
import UserContext from "../contexts/userContext";

import PWAContext from "../contexts/pwaContext";

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
	const{ prompt, promptToInstall } = useContext(PWAContext);
	const[showPrompt, setShowPrompt] = useState(false);

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

	const onInstall = () => {
		promptToInstall();
		setShowPrompt(false);
	};

	useEffect( () => {
		if(error)
			console.error(error);
	});

	useEffect( () => {
		if(user.loggedIn && tenders.length > 0 && prompt){
			setShowPrompt(true);
			console.log("Show prompt");
		}
	}, [prompt]);

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
							fromSaved={true}
						/>
					))
				}
				<Modal
					open={showPrompt}
					size="small"
					closeIcon
					closeOnDimmerClick
					closeOnEscape
					onClose={ () => { setShowPrompt(false); }}
				>
					<Modal.Header>Add Tendersearch.in to your homescreen</Modal.Header>
					<Modal.Content>
						<p>It looks like your getting use out of our app, do you wanna add to your homescreen?</p>
						<Button primary onClick={onInstall}>Add to homescreen</Button>
					</Modal.Content>

				</Modal>
			</div>
		);
}
