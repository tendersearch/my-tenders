// Styles
import "typeface-lexend-deca";
import "semantic-ui-css/semantic.min.css";
import "react-datetime/css/react-datetime.css";
import "../styles/globals.css";
import "isomorphic-fetch";

function CustomApp({ Component, pageProps }){
	return<Component {...pageProps} />;
}

export default CustomApp;
