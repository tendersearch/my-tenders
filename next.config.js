const withPWA = require("next-pwa");
const withImages = require("next-images");
const path = require("path");
require("dotenv").config();

module.exports = withImages(withPWA({
	env: {
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
	},
	pwa: {
		dest: "public"
	},
	exclude: [
		path.resolve(__dirname, "src/images/icons"),
		path.resolve(__dirname, "src/images/logo")
	],
	target: "serverless",
	webpack(config) {
		config.module.rules.push({
		  test: /\.svg$/,
		  issuer: {
			test: /\.(js|ts)x?$/,
		  },
		  use: ['@svgr/webpack'],
		});
	
		return config;
	  }
}))