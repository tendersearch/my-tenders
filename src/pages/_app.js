import PropTypes from "prop-types";
import Head from "next/head";

// Styles
import "typeface-lexend-deca";

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
			<Head>
				<script src="https://apis.google.com/js/api.js"></script>
			</Head>
			<Component {...pageProps} />
		</PWAContext.Provider>
	);
}

CustomApp.propTypes = {
	Component: PropTypes.any,
	pageProps: PropTypes.object
};

export default CustomApp;
