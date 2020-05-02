import Head from "next/head";
import Header from "../Header/Header";

export default function Layout({ title, description, children }) {
	const themeColor = "#364aa2";

	return (
		<>
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
			<footer></footer>
		</>
	)
}
