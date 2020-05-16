import PropTypes from "prop-types";

// Styles
import "typeface-lexend-deca";

// Semantic ui
import "semantic-ui-css/semantic.css";

import "react-datetime/css/react-datetime.css";
import "../styles/globals.css";
import "isomorphic-fetch";

function CustomApp({ Component, pageProps }){
	return<Component {...pageProps} />;
}

CustomApp.propTypes = {
	Component: PropTypes.any,
	pageProps: PropTypes.object
};

export default CustomApp;
