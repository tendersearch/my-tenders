import Link from "next/link";
import Logo from "../Logo/Logo";

import classNames from "classnames";

// Icons
import ProfileIcon from "../../images/icons/profile.svg";
import SavedIcon from "../../images/icons/saved.svg";

import styles from "./header.module.css";

export default function Header(){
	return(
		<header className={styles.header}>
			<nav>
				<div className={classNames(styles.saved, styles.link)}>
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

				<div className={classNames(styles.profile, styles.link)}>
					<Link href="/profile">
						<a>
							<ProfileIcon />
							<span className={styles.text}>Profile</span>
						</a>
					</Link>
				</div>
			</nav>	
		</header>
	)
}