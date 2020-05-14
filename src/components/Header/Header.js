import React, { useContext, useEffect } from "react";
import Link from "next/link";
import classNames from "classnames";

// Components
import Logo from "../Logo/Logo";

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

	const linkClasses = classNames({
		[styles.link]: true,
		[styles.disabled]: typeof window !== "undefined" ? !user.loggedIn : false
	});

	return(
		<header className={styles.header}>
			<nav>
				<div
					className={linkClasses}>
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
								<LoginWithGoogle />
							)
					}
				</div>

			</nav>
		</header>
	);
}

function LoginWithGoogle(){
	return(
		<div className={styles.googleLogin} id="googleLoginButton"></div>
	);
}
