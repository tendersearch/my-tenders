import LogoIcon from "../../images/logo/logo.png"

import styles from "./logo.module.css";

export default function Logo(){
	return(
		<div className={styles.logoWrapper}>
			<img src={LogoIcon} alt="MyTenders" className={styles.logo} />
		</div>
	)
}