import path from "path"
import webpack, { DefinePlugin } from "webpack"
import "webpack-dev-server" // Adds devServer types to configuration

import autoprefixer from "autoprefixer"
import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import HtmlHarddiskPlugin from "html-webpack-harddisk-plugin"
import HtmlPlugin from "html-webpack-plugin"

import { tsConfigPathsToWebpackAliases } from "./tsConfigPathsToWebpackAliases"
import { newStringIncrementor } from "./stringIncrementor"

const getLocalIdent = newStringIncrementor() // Produces the shortest possible unique string for class-names
const CACHE_ENABLED = true // Control caching for all rules/plugins and optimizers

const ROOT_FOLDER = path.resolve(__dirname, "../")
const SRC_FOLDER = path.resolve(ROOT_FOLDER, "src")
const INDEX_JS_FILE = path.resolve(SRC_FOLDER, "index.ts")
const INDEX_HTML_FILE = path.resolve(SRC_FOLDER, "index.html")
const DIST_FOLDER = path.resolve(ROOT_FOLDER, "dist-dev")
const TS_CONFIG_PATH = path.resolve(ROOT_FOLDER, "tsconfig.json")

export default async () => {
	const alias = await tsConfigPathsToWebpackAliases(TS_CONFIG_PATH)

	const config: webpack.Configuration = {
		mode: "development",
		devtool: "source-map",

		devServer: {
			historyApiFallback: true,
			hot: true,
			https: true,
			overlay: true,
			inline: true,
			writeToDisk: true,
			port: 3010,
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		},

		entry: [
			// https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
			"core-js/modules/es.promise",
			"core-js/modules/es.array.iterator",

			INDEX_JS_FILE
		],

		output: {
			filename: "js/[name]-[hash].js",
			chunkFilename: "js/[name]-[hash].js",
			publicPath: "https://localhost:3010/", // The last / is critical, without it reloading breaks
			path: DIST_FOLDER
		},

		resolve: {
			extensions: [".js", ".ts", ".tsx"],
			alias: {
				"react-dom": "@hot-loader/react-dom", // https://github.com/gaearon/react-hot-loader#hot-loaderreact-dom
				...alias
			}
		},

		module: {
			rules: [
				{
					// https://github.com/gaearon/react-hot-loader#typescript
					exclude: /node_modules/,
					test: /\.(t|j)sx?$/,
					use: [
						{
							loader: "babel-loader",
							options: {
								cacheDirectory: CACHE_ENABLED,
								babelrc: false,
								presets: [
									[
										"@babel/preset-env", // Adds dynamic imports of the necessary polyfills (see .browserslistrc for spec)
										{
											useBuiltIns: "usage",
											corejs: { version: 3, proposals: true }
										}
									],
									"@babel/preset-typescript",
									"@babel/preset-react"
								],
								plugins: [
									["@babel/plugin-proposal-class-properties", { loose: true }],
									"@babel/plugin-transform-runtime", // Adds support for async/await in older browsers
									"react-hot-loader/babel"
								]
							}
						}
					]
				},
				{
					// Parses non-modular scss files
					test: /\.global\.s?css$/,
					exclude: /node_modules/,
					use: [
						"style-loader",
						"css-loader",
						{
							loader: "postcss-loader",
							options: {
								plugins: [autoprefixer]
							}
						},
						{
							loader: "sass-loader",
							options: {
								sassOptions: {
									outputStyle: "compressed"
								}
							}
						}
					]
				},
				{
					// Parses modular scss files
					exclude: /\.global\.s?css$/,
					test: /\.s?css$/,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								importLoaders: 2, // How many loaders should be applied to imported resources before this one
								modules: {
									// localIdentName: "[path][name]_[local]" // Turn this on for full class names during debugging
									getLocalIdent // Turn this on for shortest possible class names
								}
							}
						},
						{
							loader: "postcss-loader",
							options: {
								plugins: [autoprefixer]
							}
						},
						{
							loader: "sass-loader",
							options: {
								sassOptions: {
									outputStyle: "compressed"
								}
							}
						}
					]
				}
			]
		},
		plugins: [
			new HtmlPlugin({
				template: INDEX_HTML_FILE,
				alwaysWriteToDisk: true,
				minify: false
			}),
			new HtmlHarddiskPlugin(),
			new ForkTSCheckerPlugin({
				tsconfig: TS_CONFIG_PATH
			}),
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify("development")
			})
		]
	}

	return config
}
