import PropTypes from "prop-types";
import classNames from "classnames";

// Semantic ui
import { Input, Icon } from "semantic-ui-react";

// Icons
import AlgoliaImage from "../../images/algolia.png";

// Styles
import styles from "./search.module.css";

export default function SearchInput({ onSubmit, onChange, onFocus, onBlur, defaultValue = "", className = "" }){
	const handleSubmit = (e) => {
		const value = e.target.value;

		if(e.key === "Enter")
			onSubmit(value);
	};

	const handleChange = e => {
		if(!onChange) return;

		const value = e.target.value;

		onChange(value);
	};

	return(
		<div className={classNames(styles.search, className)}>
			<Input fluid icon placeholder="Enter keyword ex- road,mask,solar,garden, etc. " onKeyUp={handleSubmit} onChange={handleChange}>
				<input
					defaultValue={defaultValue}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				<Icon name="search" />
			</Input>
			<div className={styles.algolia}>
				Search is powered by Algolia <img src={AlgoliaImage} className={styles.icon} alt="icon" />
			</div>

		</div>
	);
}

SearchInput.propTypes = {
	onSubmit: PropTypes.func,
	onChange: PropTypes.func,
	defaultValue: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	className: PropTypes.string
};
