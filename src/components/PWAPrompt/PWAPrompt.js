import PropTypes from "prop-types";

// Components
import { Icon, Button } from "semantic-ui-react";

// Icons
import LogoIcon from "../../images/logo/logo.svg";

// Styles
import styles from "./pwaPrompt.module.css";

export default function PWAPrompt({ onInstall, onClose }){
	return(
		<div className={styles.container}>
			<div className={styles.inner}>
				<div className={styles.row}>
					<LogoIcon className={styles.logo} />
					<div className={styles.info}>
						<span className={styles.heading}>Tendersearch</span>
						<span className={styles.url}>tendersearch.in</span>
					</div>
					<Icon name="close" className={styles.close} color="black" onClick={onClose} />
				</div>
				<div className={`${styles.row} ${styles.buttonRow}`}>
					<Button className={styles.install} onClick={onInstall} primary>Add to homescreen</Button>
				</div>
			</div>

		</div>
	);
}

PWAPrompt.propTypes = {
	onInstall: PropTypes.func,
	onClose: PropTypes.func
};
