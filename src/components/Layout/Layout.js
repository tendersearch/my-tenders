import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-hooks";
import auth from "../../util/Auth";
import client from "../../util/client";
import PropTypes from "prop-types";

// Context
import UserContext from "../../contexts/userContext";

const Footer = dynamic( () => import("../Footer/Footer") );
const Header = dynamic( () => import("../Header/Header") );

export default function Layout({ title, description, children, searchIsFocused }){
	const isDesktop = useMediaQuery({
		query: "(min-width: 800px)"
	});

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

					<link rel="preconnect" href="https://apis.google.com" />
					<link rel="preconnect" href="https://accounts.google.com" />
					<link rel="preconnect" href="https://ssl.gstatic.com" />
				</Head>
				<Header />
				<main>{children}</main>
				{
					!isDesktop
						? searchIsFocused ? "" : <Footer />
						: ""
				}
			</ApolloProvider>
		</UserContext.Provider>
	);
}

Layout.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	children: PropTypes.node,
	searchIsFocused: PropTypes.bool
};
