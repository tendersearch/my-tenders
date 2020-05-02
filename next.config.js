const withPWA = require("next-pwa");
const withImages = require("next-images");

module.exports = withImages(withPWA({
	pwa: {
		dest: "public"
	},
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