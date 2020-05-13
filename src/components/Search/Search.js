import { Input, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";

// Icons
import AlgoliaImage from "../../images/algolia.png";

// Styles
import styles from "./search.module.css";

export default function SearchInput({ onSubmit }){
	const handleSubmit = (e) => {
		const value = e.target.value;

		if(e.key === "Enter")
			onSubmit(value);
	};

	return(
		<div className={styles.search}>
			<Input fluid icon placeholder="search..." onKeyUp={handleSubmit}>
				<input />
				<Icon name="search" />
			</Input>
			<div className={styles.algolia}>
				Search is powered by Algolia <img src={AlgoliaImage} className={styles.icon} alt="icon" />
			</div>

		</div>
	);
}

SearchInput.propTypes = {
	onSubmit: PropTypes.func
};
