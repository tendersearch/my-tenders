import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import classNames from "classnames";

// Components
import Logo from "../Logo/Logo";
import { GoogleLogin } from "react-google-login";
import { Loader, Button, Icon } from "semantic-ui-react";

// Contexts
import UserContext from "../../contexts/userContext";

// Util
import auth from "../../util/Auth";

// Icons
import ProfileIcon from "../../images/icons/profile.svg";
import SavedIcon from "../../images/icons/saved.svg";

import styles from "./header.module.css";

export default function Header(){
	const user = useContext(UserContext);
	const[loggingIn, setLoggingIn] = useState(false);

	useEffect( () => {
		const loadSignIn = () => {
			if(auth.google)
				gapi.load("signin2", () => {
					gapi.signin2.render("googleLoginButton", {
						onsuccess: auth.signIn.bind(auth)
					});
				});
		};

		if(auth.google)
			loadSignIn();

		if(!auth.google)
			setTimeout(loadSignIn, 1000);
	});

	return(
		<header className={styles.header}>
			<nav>
				<div
					className={classNames({
						[styles.link]: true,
						[styles.disabled]: !user.loggedIn
					})}>
					<Link href="/saved">
						<a>
							<SavedIcon />
							<span className={styles.text}>Saved</span>
						</a>
					</Link>
				</div>

				<Link href="/">
					<a className={styles.home}>
						<Logo />
					</a>
				</Link>

				<div className={styles.link}>
					{
						user.loggedIn
							? (

								<Link href="/profile">
									<a>
										<ProfileIcon />
										<span className={styles.text}>Profile</span>
									</a>
								</Link>

							)
							: (
								<LoginWithGoogle
									loggingIn={loggingIn}
									onClick={auth.signIn}
								/>
							)
					}
				</div>

			</nav>
		</header>
	);
}

function LoginWithGoogle({ loggingIn, onSuccess, onRequest, onCompleted }){
	if(!loggingIn)
		return(
			<div className={styles.googleLogin} id="googleLoginButton"></div>
		);

	if(loggingIn)
		return(
			<div className={styles.googleLogin}>
				<Loader active={loggingIn} />
			</div>
		);
}
