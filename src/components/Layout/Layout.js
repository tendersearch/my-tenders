import React, { useState } from "react";
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

	auth.on("user_change", (user) => {
		console.log("Updated user", user);
		setUser(user);
	});

	return(
		<UserContext.Provider value={user}>
			<ApolloProvider client={client}>
				<Head>
					<title>{title}</title>
					<meta name="description" content={description} />
					<link rel="icon" href="/favicon.ico" />

					<link rel="manifest" href="/manifest.json" />
					<link href='/favicon-16x16.png' rel='icon' type='image/png' sizes='16x16' />
					<link href='/favicon-32x32.png' rel='icon' type='image/png' sizes='32x32' />
					<link rel="apple-touch-icon" href="/apple-icon.png"></link>
					<meta name="theme-color" content={themeColor}/>
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
