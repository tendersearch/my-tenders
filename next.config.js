const withPWA = require("next-pwa");
const withImages = require("next-images");
const path = require("path");

module.exports = withImages(withPWA({
	pwa: {
		dest: "public"
	},
	exclude: [
		path.resolve(__dirname, "src/images/icons"),
		path.resolve(__dirname, "src/images/logo")
	],
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