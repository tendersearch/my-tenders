import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { ApolloProvider } from "@apollo/react-hooks";
import auth from "../../util/Auth";
import client from "../../util/client";
import PropTypes from "prop-types";

// Context
import UserContext from "../../contexts/userContext";

export default function Layout({ title, description, children }){
	const[user, setUser] = useState(auth.user);
	const themeColor = "#364aa2";

	useEffect( () => {
		auth.once("user_change", setUser);
	});

	return(
		<UserContext.Provider value={user}>
			<ApolloProvider client={client}>
				<Head>
					<title>{title}</title>
					<meta name="description" content={description} />
					<link rel="shortcut icon" href="/icons/icon-72x72.png" />

					<link rel="manifest" href="/manifest.json" />
					<link href='/icons/icon-16x16.png' rel='icon' type='image/png' sizes='16x16' />
					<link href='/icons/icon-32x32.png' rel='icon' type='image/png' sizes='32x32' />
					<link rel="apple-touch-icon" href="/icons/icon-144x144.png"></link>
					<meta name="theme-color" content={themeColor}/>

					<script src="https://apis.google.com/js/api.js" async defer></script>
				</Head>
				<Header />
				<main>{children}</main>
				<Footer />
			</ApolloProvider>
		</UserContext.Provider>
	);
}

Layout.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	children: PropTypes.node
};
