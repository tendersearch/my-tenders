import LogoIcon from "../../images/logo/logo.svg";

import styles from "./logo.module.css";

export default function Logo(){
	return(
		<div className={styles.logoWrapper}>
			<LogoIcon alt="Tendersearch" className={styles.logo} />
			<span className={styles.wordmark}>Tendersearch</span>
		</div>
	);
}
