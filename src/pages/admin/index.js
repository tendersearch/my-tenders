import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import auth from "../../util/Auth";

// Semantic ui
import { Button, Icon, Divider, Loader } from "semantic-ui-react";

// Styles
import styles from "../../styles/admin.module.css";

// Components
import Layout from "../../components/Layout/Layout";
import UserContext from "../../contexts/userContext";
const AddTendersForm = dynamic( () => import("../../components/AddTendersForm/AddTendersForm"));
const AddTendersFromSpreadsheet = dynamic( () => import("../../components/AddTendersFromSpreadsheet/AddTendersFromSpreadsheet"));
const RemoveTenders = dynamic( () => import("../../components/RemoveTenders/RemoveTenders"));

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
	const[hasScopes, setHasScopes] = useState(null);
	const user = useContext(UserContext);

	useEffect( () => {
		auth.on("ready", () => {
			setHasScopes(auth.google.currentUser.get().hasGrantedScopes(auth.adminScopes));
		});
	});

	if(user.loggedIn)
		if(hasScopes !== null){
			if(user.role === "ADMIN")
				return<Admin />;
			if(user.role !== "ADMIN" || !hasScopes)
				return<NotAdmin user={user} />;
		}else{
			return<Loader active />;
		}
	else
		return<NotAdmin user={user} />;
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
			<section>
				<h2>Add Tenders</h2>
				<AddTendersFromSpreadsheet className={styles.tendersFromSheet} />
				<Divider horizontal style={{ margin: "50px 0" }}>OR</Divider>
				<AddTendersForm />
			</section>
			<section>
				<h2>Remove tenders</h2>
				<RemoveTenders />
			</section>

		</div>
	);
};

NotAdmin.propTypes = {
	user: PropTypes.object
};
