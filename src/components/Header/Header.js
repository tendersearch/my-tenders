import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";

// Components
import Logo from "../Logo/Logo";
import { GoogleLogin } from "react-google-login";
import { Loader } from "semantic-ui-react";

// Contexts
import UserContext from "../../contexts/userContext";
import MethodContext from "../../contexts/methodContext";

// Util
import loginUser from "../../util/loginUser";

// Icons
import ProfileIcon from "../../images/icons/profile.svg";
import SavedIcon from "../../images/icons/saved.svg";

import styles from "./header.module.css";

export default function Header(){
	const router = useRouter();
	const user = useContext(UserContext);
	const{ fetchUser } = useContext(MethodContext);
	const[loggingIn, setLoggingIn] = useState(false);

	const onRequest = () => {
		setLoggingIn(true);
	};

	const onCompleted = () => {
		setLoggingIn(false);
	};

	const onSuccess = async data => {
		await loginUser(data);

		router.reload();
	};

	return(
		<header className={styles.header}>
			<nav>
				<div
					className={classNames(styles.saved, styles.link, (!user || !user.loggedIn ? styles.disabled : ""))}>
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

				{
					user && user.loggedIn
						? (
							<div className={classNames(styles.profile, styles.link)}>
								<Link href="/profile">
									<a>
										<ProfileIcon />
										<span className={styles.text}>Profile</span>
									</a>
								</Link>
							</div>
						)
						: (
							<div className={styles.googleLogin}>
								{
									!loggingIn ? (
										<GoogleLogin
											clientId={process.env.GOOGLE_CLIENT_ID}
											buttonText="Login with Google"
											scope="email profile"
											onSuccess={onSuccess}
											onRequest={onRequest}
											onCompleted={onCompleted}
										/>
									)
										: (
											<Loader active={loggingIn} />
										)
								}

							</div>

						)
				}

			</nav>
		</header>
	);
}
