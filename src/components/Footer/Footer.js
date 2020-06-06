import { useState } from "react";
import Link from "next/link";
import auth from "../../util/Auth";
import GoogleButton from "../GoogleButton/GoogleButton";

// Styles
import styles from "./footer.module.css";

// Icons
import SvgProfile from "../../images/icons/profile.svg";
import SvgHome from "../../images/icons/home.svg";
import SvgSaved from "../../images/icons/saved2.svg";

function Footer(){
	return(
		<footer className={styles.footer}>
			<nav>
				{
					auth.user.loggedIn
						? <LoggedInView />
						: <LoggedOutView />
				}
			</nav>
		</footer>
	);
}

function LoggedOutView(){
	const[loggingIn, setLoggingIn] = useState(false);

	const onLogin = async () => {
		setLoggingIn(true);
		const user = await auth.triggerSignup().catch( () => { setLoggingIn(false); } );
		console.log(user);
		setLoggingIn(false);
	};

	return(
		<>
			<Link href="/">
				<a>
					<SvgHome alt="Home" />
						Home
				</a>
			</Link>

			<GoogleButton onClick={onLogin} loading={loggingIn} />
		</>
	);
}

function LoggedInView(){
	return(
		<>
			<Link href="/profile">
				<a>
					<SvgProfile alt="Profile" />
						Profile
				</a>
			</Link>

			<Link href="/">
				<a>
					<SvgHome alt="Home" />
						Home
				</a>
			</Link>

			<Link href="/saved">
				<a>
					<SvgSaved alt="Saved" />
						Saved
				</a>
			</Link>
		</>
	);
}

export default Footer;
