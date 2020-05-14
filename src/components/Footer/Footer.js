import Link from "next/link";
import auth from "../../util/Auth";

// Styles
import styles from "./footer.module.css";

// Icons
import SvgProfile from "../../images/icons/profile.svg";
import SvgHome from "../../images/icons/home.svg";
import SvgSaved from "../../images/icons/saved.svg";
import { useEffect } from "react";

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
	useEffect( () => {
		const loadSignIn = () => {
			if(!auth.user.loggedIn && auth.google)
				gapi.load("signin2", () => {
					gapi.signin2.render("footerLoginButton", {
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
		<>
			<Link href="/">
				<a>
					<SvgHome alt="Home" />
						Home
				</a>
			</Link>

			<div id="footerLoginButton"></div>
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
