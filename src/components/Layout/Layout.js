import React, { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-hooks";
import auth from "../../util/Auth";
import client from "../../util/client";
import PropTypes from "prop-types";

// Context
import UserContext from "../../contexts/userContext";
import PWAContext from "../../contexts/pwaContext";

const PWAPrompt = dynamic( () => import("../PWAPrompt/PWAPrompt") );
const Footer = dynamic( () => import("../Footer/Footer") );
const Header = dynamic( () => import("../Header/Header") );

export default function Layout({ title, description, children, searchIsFocused }){
	const hide = typeof window !== "undefined" ? (sessionStorage.getItem("hidePrompt") || "false") : "false";
	const{ prompt, promptToInstall } = useContext(PWAContext);
	const[showPrompt, setShowPrompt] = useState(prompt !== null && hide === "false");

	const isDesktop = useMediaQuery({
		query: "(min-width: 800px)"
	});

	const[user, setUser] = useState(auth.user);
	const themeColor = "#364aa2";

	const handleInstall = async e => {
		// Show the native install prompt.
		promptToInstall();

		// Get the user's choice.
		const userChoice = await prompt.userChoice;

		// If user canceled install, don't do anything.
		if(userChoice.outcome === "dismissed") return;

		// If user installed the PWA, hide the prompt.
		sessionStorage.setItem("hidePrompt", "true");
	};

	const onClose = e => {
		sessionStorage.setItem("hidePrompt", true);
		setShowPrompt(false);
	};

	useEffect( () => {
		auth.once("user_change", setUser);
	});

	useEffect( () => {
		setShowPrompt(prompt !== null && hide !== "true");
	}, [prompt]);

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
					<link rel="apple-touch-icon" href="/icons/icon-144x144.png" />

					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="default" />

					<link rel="apple-touch-startup-image" href="/images/splash/launch-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
					<link rel="apple-touch-startup-image" href="/images/splash/launch-750x1294.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
					<link rel="apple-touch-startup-image" href="/images/splash/launch-1242x2148.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
					<link rel="apple-touch-startup-image" href="/images/splash/launch-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
					<link rel="apple-touch-startup-image" href="/images/splash/launch-1536x2048.png" media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" />
					<link rel="apple-touch-startup-image" href="/images/splash/launch-1668x2224.png" media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" />
					<link rel="apple-touch-startup-image" href="/images/splash/launch-2048x2732.png" media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)" />
					<meta name="apple-mobile-web-app-title" content="Tendersearch" />

					<meta name="theme-color" content={themeColor}/>

					<link rel="preconnect" href="https://apis.google.com" />
					<link rel="preconnect" href="https://accounts.google.com" />
					<link rel="preconnect" href="https://ssl.gstatic.com" />
				</Head>
				<Header />
				<main>
					{children}

					{
						showPrompt
							? <PWAPrompt onInstall={handleInstall} onClose={onClose} />
							: null
					}
				</main>
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
