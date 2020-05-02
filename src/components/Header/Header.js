import Logo from "../Logo/Logo";

import styles from "./header.module.css";

export default function Header(){
	return(
		<header className={styles.header}>
			<Logo />
		</header>
	)
}