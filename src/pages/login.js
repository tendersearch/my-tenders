import Layout from "../components/Layout/Layout";
import { GoogleLogin } from "react-google-login";

import styles from "../styles/login.module.css";

export default function login(){
	return(
		<Layout 
			title="Login to MyTenders"
			description="Login with your Google account to save tenders."
		>
			<div className={styles.container}>
				<h1>Login to MyTenders</h1>
				<GoogleLogin 
					className={styles.googleLogin}
					clientId={process.env.GOOGLE_CLIENT_ID}
					buttonText="Login with Google"
					scope="email profile"
					onSuccess={loginUser}
				/>
			</div>
		</Layout>
	);
}

async function loginUser(data){
	const { accessToken, tokenId } = data;

	const response = await fetch("/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			accessToken,
			tokenId
		})
	});

	const result = await response.json();

	console.log(result);
}