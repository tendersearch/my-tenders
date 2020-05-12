import Link from "next/link";
import { useState, useContext } from "react";
import PropTypes from "prop-types";
import auth from "../../util/Auth";

// Components
import Layout from "../../components/Layout/Layout";
import UserContext from "../../contexts/userContext";
import { Button } from "semantic-ui-react";
import AddTendersForm from "../../components/AddTendersForm/AddTendersForm";

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
	const user = useContext(UserContext);

	return(
		<>
			{
				!user.loggedIn || user.role !== "ADMIN"
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
							<Button loading={loading} primary onClick={onBecomeAdmin}>Become admin</Button>
							<span className={styles.disclaimer}>There can only be one admin</span>
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
				<AddTendersForm />
			</section>

		</div>
	);
};

NotAdmin.propTypes = {
	user: PropTypes.object
};
