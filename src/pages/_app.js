import PropTypes from "prop-types";

// Styles
import "typeface-lexend-deca";

// Semantic ui
import "semantic-ui-css/semantic.css";
/* import "semantic-ui-css/components/dropdown.min.css";
import "semantic-ui-css/components/button.min.css";
import "semantic-ui-css/components/form.min.css";
import "semantic-ui-css/components/input.min.css";
import "semantic-ui-css/components/label.min.css";
import "semantic-ui-css/components/message.min.css";
import "semantic-ui-css/components/loader.min.css";
import "semantic-ui-css/components/icon.min.css";
import "semantic-ui-css/components/divider.min.css";
import "semantic-ui-css/components/header.min.css";
import "semantic-ui-css/components/modal.min.css"; */

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
