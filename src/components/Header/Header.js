import React, { useContext, useState } from "react";
import Link from "next/link";
import classNames from "classnames";

// Components
import Logo from "../Logo/Logo";
import GoogleButton from "../GoogleButton/GoogleButton";

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

	const onLogin = async () => {
		setLoggingIn(true);
		const user = await auth.triggerSignup().catch( () => {
			setLoggingIn(false);

			return false;
		} );
		console.log(user);
		setLoggingIn(false);
	};

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
							: <GoogleButton onClick={onLogin} loading={loggingIn} />
					}
				</div>

			</nav>
		</header>
	);
}
