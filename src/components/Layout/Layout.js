import Head from "next/head";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import client from "../../util/client";
import {ApolloProvider} from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import gql from "graphql-tag";

// Context
import UserContext from "../../contexts/userContext";
import MethodContext from "../../contexts/methodContext";

const CURRENT_USER = gql`
query{
	currentUser{
		name
		email
		userId
	}
}
`

async function getUser(){
	try{
		const currentUserResult = await client.query({ query: CURRENT_USER });
		const { data, errors } = currentUserResult;
		const currentUser = data.currentUser;
		currentUser.loggedIn = true;

		return currentUser;
	}catch(err){
		console.error(err);

		return { loggedIn: false };
	}
	
}

export default function Layout({ title, description, children }) {
	const[user, setUser] = useState(null);
	const themeColor = "#364aa2";

	const fetchUser = async () => {
		const currentUser = await getUser();

		setUser(currentUser);
	}

	useEffect( () => {
		if(!user)
			fetchUser();
	}, [user]);

	const methods = {
		fetchUser
	}

	return (
		<ApolloProvider client={client}>
			<MethodContext.Provider value={methods}>
				<UserContext.Provider value={user}>
					
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
				
				</UserContext.Provider>
			</MethodContext.Provider>
		</ApolloProvider>
		
	)
}
