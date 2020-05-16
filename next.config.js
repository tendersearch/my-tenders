const path = require("path");
const withPWA = require("next-pwa");
const withImages = require("next-images");
const withPurgeCss = require("next-purgecss");
const withPlugins = require("next-compose-plugins");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
require("dotenv").config();

const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = withPlugins(
	[
		[
			withPWA, {
				pwa: {
					dest: "public",
					disable: !isEnvProduction,
					register: isEnvProduction
				}
			}
		],
		[
			withImages,
			{
				exclude: [
					path.resolve(__dirname, "src/images/icons"),
					path.resolve(__dirname, "src/images/logo")
				]
			}
		],
		[
			withPurgeCss, {
				purgeCssEnabled: () => isEnvProduction,
				purgeCss: {
					whitelistPatterns: () => [
						/(html|body|before|after|root|not|a|p|i|span|h1|h2|h3|h4|h5|h6)/,
						/(button|input|optgroup|select|textarea)/,
						/.*_.*/,
						/ui.*(button|form|input|label|labels|message|loader|icon|divider|header|modal)/,
						/(active|loading|visible|hidden|selection|field|fields)/
					],
					whitelistPatternsChildren: () => [
						/dropdown/
					]
				}
			}
		]
	], {
		compress: true,
		env: {
			GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
			FAUNADB_GUEST_KEY: process.env.FAUNADB_GUEST_KEY,
			ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
			ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY
		},
		webpack(config){
			config.entry.vendor = [];
			config.entry.vendor.push("semantic-ui-react");

			const startRules = config.module.rules;
			const newRules = [
				...startRules,
				{
					test: /.*.svg$/,
					issuer: {
						test: /\.(js|ts)x?$/
					},
					use: ["@svgr/webpack"]
				}
			];
			config.plugins = config.plugins || [];
			config.plugins.push(new OptimizeCSSAssetsPlugin({
				cssProcessorPluginOptions: {
					preset: ["default", { discardComments: { removeAll: true } }]
				}
			}));

			config.module.rules = newRules;
			return config;
		}
	});
