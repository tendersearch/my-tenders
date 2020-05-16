import PropTypes from "prop-types";

// Icons
import GoogleIcon from "../../images/icons/google.svg";

// Styles
import styles from "./googleButton.module.css";

function GoogleButton({ onClick, text = "Log in", loading = false }){
	return(
		<button className={styles.button} onClick={onClick} disabled={loading}>
			{
				loading
					? <Loader active />
					: <ButtonContent text={text} />
			}

		</button>
	);
}

const ButtonContent = ({ text }) => (
	<>
		<GoogleIcon className={styles.icon} />
		<span className={styles.text}>{text}</span>
	</>
);

const Loader = () => (
	<div className={styles.loader}></div>
);

GoogleButton.propTypes = {
	onClick: PropTypes.func,
	text: PropTypes.string,
	loading: PropTypes.bool
};

ButtonContent.propTypes = {
	text: PropTypes.string
};

export default GoogleButton;
