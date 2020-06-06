import PropTypes from "prop-types";

// Styles
import "typeface-lexend-deca";
import "typeface-poppins";

// Semantic ui
import "semantic-ui-css/semantic.css";

import "react-datetime/css/react-datetime.css";
import "../styles/globals.css";
import "isomorphic-fetch";

import PWAContext from "../contexts/pwaContext";
import { usePWA } from "../util/usePWA";

function CustomApp({ Component, pageProps }){
	const[prompt, promptToInstall] = usePWA();

	return(
		<PWAContext.Provider value={ { prompt, promptToInstall } }>
			<Component {...pageProps} />
		</PWAContext.Provider>
	);
}

CustomApp.propTypes = {
	Component: PropTypes.any,
	pageProps: PropTypes.object
};

export default CustomApp;
