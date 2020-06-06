const path = require("path");
const withReactSvg = require("next-react-svg");
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
					disable: false/* !isEnvProduction */,
					register: true/* isEnvProduction */
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
				purgeCssEnabled: ({ dev, isServer }) => (!dev && !isServer),
				purgeCss: {
					whitelistPatterns: () => [
						/(html|body|root|^a$|p|i|span|h1|h2|h3|h4|h5|h6|^nav$)/,
						/(button|input|optgroup|select|textarea)/,
						/.*_.*/,
						// Dropdown
						/(dropdown|fluid|selection|search|icon|transition|menu|item|text)/,
						// Form
						/(form|field|fields|equal|width|labeled|label)/,
						// Message
						/message/,
						// Modal
						/(modals|modal|dimmer|transition|page)/,
						// Icons
						/(icon|close|red|key)/,
						// Modifiers
						/(active|selected|error|success|visible|hidden|basic|mini|transition|header|content)/,
						/* /ui?(button|form|input|label|labels|message|loader|icon|divider|header|modal)/, */
						/(active|loading|visible|hidden|selection|field|fields)/
					],
					whitelistPatternsChildren: [
						/form/
					],
					css: () => [/semantic.css$/]
				}
			}
		],
		[
			withReactSvg, {
				include: path.resolve(__dirname, "src/images")
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
				...startRules
			];
			if(isEnvProduction){
				config.plugins = config.plugins || [];
				config.plugins.push(new OptimizeCSSAssetsPlugin({
					cssProcessorPluginOptions: {
						preset: ["default", { discardComments: { removeAll: true } }]
					}
				}));
			}

			config.module.rules = newRules;
			return config;
		}
	});
