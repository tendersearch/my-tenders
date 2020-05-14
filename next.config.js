const withPWA = require("next-pwa");
const withImages = require("next-images");
const path = require("path");
require("dotenv").config();

module.exports = withImages(withPWA({
	env: {
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		FAUNADB_GUEST_KEY: process.env.FAUNADB_GUEST_KEY,
		ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
		ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY
	},
	pwa: {
		dest: "public",
		disable: process.env.NODE_ENV === "development",
		register: process.env.NODE_ENV !== "development"
	},
	exclude: [
		path.resolve(__dirname, "src/images/icons"),
		path.resolve(__dirname, "src/images/logo")
	],
	target: "serverless",
	webpack(config){
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				test: /\.(js|ts)x?$/
			},
			use: ["@svgr/webpack"]
		});

		return config;
	}
}));
