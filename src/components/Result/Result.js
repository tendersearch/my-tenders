import classNames from "classnames";
import PropTypes from "prop-types";
import moment from "moment";

// Styles
import styles from "./result.module.css";

// Icons
import LocationIcon from "../../images/icons/location.svg";
import SaveIcon from "../../images/icons/saved.svg";

export default function Result({ name, city, state, description, endDate, openingDate, estAmount, emd }){
	return(
		<div className={styles.result}>
			<div className={styles.save}>
				<SaveIcon />
			</div>
			<div className={styles.nameAndLocation}>
				<span className={styles.name}>{name}</span>
				<div className={styles.location}>
					<LocationIcon className={styles.icon} />
					<span className={styles.text}>{city}, {state}.</span>
				</div>
			</div>
			<p className={styles.description}>
				{description}
			</p>
			<div className={styles.meta}>
				<div className={classNames(styles.endDate, styles.metaInfo)}>
					<span className={styles.label}>End Date</span>
					<span className={styles.value}>{parseDate(endDate)}</span>
				</div>
				<div className={classNames(styles.openingDate, styles.metaInfo)}>
					<span className={styles.label}>Opening Date</span>
					<span className={styles.value}>{parseDate(openingDate)}</span>
				</div>
				<div className={classNames(styles.estAmount, styles.metaInfo)}>
					<span className={styles.label}>Estimated Amount</span>
					<span className={styles.value}>Rs. {parseNumber(estAmount)}</span>
				</div>
				<div className={classNames(styles.emdAmount, styles.metaInfo)}>
					<span className={styles.label}>EMD Amount</span>
					<span className={styles.value}>Rs. {parseNumber(emd)}</span>
				</div>
			</div>
		</div>
	);
}

function parseDate(dateStr){
	return moment(dateStr).format("DD-MMM-YYYY hh:mm A");
}

function parseNumber(numStr){
	return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(numStr);
}

Result.propTypes = {
	name: PropTypes.string,
	city: PropTypes.string,
	state: PropTypes.string,
	description: PropTypes.string,
	endDate: PropTypes.string,
	openingDate: PropTypes.string,
	estAmount: PropTypes.number,
	emd: PropTypes.number
};
