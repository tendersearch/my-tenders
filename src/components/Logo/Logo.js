import LogoIcon from "../../images/logo/logo.svg";

import styles from "./logo.module.css";

export default function Logo(){
	return(
		<div className={styles.logoWrapper}>
			<LogoIcon alt="MyTenders" className={styles.logo} />
			<span className={styles.wordmark}>MyTenders</span>
		</div>
	);
}
