import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import auth from "../../util/Auth";

// Components
import Layout from "../../components/Layout/Layout";
import UserContext from "../../contexts/userContext";
import AddTendersForm from "../../components/AddTendersForm/AddTendersForm";
import AddTendersFromSpreadsheet from "../../components/AddTendersFromSpreadsheet/AddTendersFromSpreadsheet";

// Semantic ui
import { Button, Icon, Divider } from "semantic-ui-react";

// Styles
import styles from "../../styles/admin.module.css";

export default function admin(){
	return(
		<Layout
			title="Admin panel"
		>
			<Display />
		</Layout>
	);
}

const Display = () => {
	const[hasScopes, setHasScopes] = useState(
		auth.google
			? auth.google.currentUser.get().hasGrantedScopes(auth.adminScopes)
			: false);
	const user = useContext(UserContext);

	useEffect( () => {
		auth.onReady = () => {
			setHasScopes(auth.google.currentUser.get().hasGrantedScopes(auth.adminScopes));
		};
	});

	return(
		<>
			{
				!user.loggedIn || user.role !== "ADMIN" || !hasScopes
					? <NotAdmin user={user} />
					: <Admin />
			}
		</>
	);
};

const NotAdmin = ({ user }) => {
	const[ loading, setLoading ] = useState(false);
	const[ error, setError ] = useState("");
	const isLoggedIn = user.loggedIn;
	const onBecomeAdmin = async () => {
		setLoading(true);
		const status = await auth.becomeAdmin();
		if(status){
			await auth.google.currentUser.get().grant({
				scope: auth.adminScopes
			});
			setLoading(false);
			await auth.getUser();
			return;
		}

		setError("Cannot become admin because one already exists.");
		setLoading(false);
	};

	return(
		<div className={styles.container}>
			<h1>Sorry, you do not have access.</h1>
			<p>You do not have access to this page. <Link href="/"><a>Go back home</a></Link></p>
			{
				isLoggedIn
					? (
						<div className={styles.becomeAdmin}>
							<Button
								onClick={onBecomeAdmin}
								primary
								loading={loading}
							>
								<Icon name="key" />
								Become Admin
							</Button>
							<span className={styles.disclaimer}>There can only be one admin. The admin user needs additional permissions to read from the Google Sheets API.</span>
							<p className={styles.error}>{error}</p>
						</div>
					)
					: ""
			}

		</div>
	);
};

const Admin = () => {
	return(
		<div className={styles.container}>
			<h1>Admin panel</h1>
			<section className={styles.loggedIn}>
				<h2>Add Tenders</h2>
				<AddTendersFromSpreadsheet className={styles.tendersFromSheet} />
				<Divider horizontal style={{ margin: "50px 0" }}>OR</Divider>
				<AddTendersForm />
			</section>

		</div>
	);
};

NotAdmin.propTypes = {
	user: PropTypes.object
};
