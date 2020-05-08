import classNames from "classnames";

// Styles
import styles from "./result.module.css";

// Icons
import LocationIcon from "../../images/icons/location.svg";
import SaveIcon from "../../images/icons/saved.svg";

export default function Result(){
	return(
		<div className={styles.result}>
			<div className={styles.save}>
				<SaveIcon />
			</div>
			<div className={styles.nameAndLocation}>
				<span className={styles.name}>AAI Cargo Logistics and Allied Services Company Ltdrity Of India</span>
				<div className={styles.location}>
					<LocationIcon className={styles.icon} />
					<span className={styles.text}>Chennai, Tamil Nadu.</span>
				</div>
			</div>
			<p className={styles.description}>
			M/O OF Electrical and Mechanical Installations, AC, water coolers and sliding gate on air side at Integrated Air Cargo Complex at Chennai Airport, Chennai
			</p>
			<div className={styles.meta}>
				<div className={classNames(styles.endDate, styles.metaInfo)}>
					<span className={styles.label}>End Date</span>
					<span className={styles.value}>27-Apr-2020 06:00 PM</span>
				</div>
				<div className={classNames(styles.openingDate, styles.metaInfo)}>
					<span className={styles.label}>Opening Date</span>
					<span className={styles.value}>30-Apr-2020 11:30 PM</span>
				</div>
				<div className={classNames(styles.estAmount, styles.metaInfo)}>
					<span className={styles.label}>Estimated Amount</span>
					<span className={styles.value}>Rs. 1,180</span>
				</div>
				<div className={classNames(styles.emdAmount, styles.metaInfo)}>
					<span className={styles.label}>EMD Amount</span>
					<span className={styles.value}>Rs. 4,17,950</span>
				</div>
			</div>
		</div>
	);
}
