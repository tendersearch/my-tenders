import Link from "next/link";

// Styles
import styles from "./footer.module.css";

// Icons
import SvgProfile from "../../images/icons/profile.svg";
import SvgHome from "../../images/icons/home.svg";
import SvgSaved from "../../images/icons/saved.svg";

function Footer(){
	return(
		<footer className={styles.footer}>
			<nav>
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
			</nav>
		</footer>
	);
}

export default Footer;
