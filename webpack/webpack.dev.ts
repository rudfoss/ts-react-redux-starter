import path from "path"
import webpack from "webpack"
import "webpack-dev-server" // Adds devServer types to configuration

import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import HtmlHarddiskPlugin from "html-webpack-harddisk-plugin"
import HtmlPlugin from "html-webpack-plugin"

const THEME = (process.env.THEME || "light") + "/" // Which theme to use for js-internal
const CACHE = true // Control caching for all rules/plugins and optimizers

// TODO: Make dynamic
const ROOT_FOLDER = path.resolve(__dirname, "../")
const NODE_MODULES_FOLDER = path.resolve(ROOT_FOLDER, "../node_modules")
const SRC_FOLDER = path.resolve(ROOT_FOLDER, "src")
const INDEX_JS_FILE = path.resolve(SRC_FOLDER, "index.ts")
const INDEX_HTML_FILE = path.resolve(SRC_FOLDER, "index.html")
const DIST_FOLDER = path.resolve(ROOT_FOLDER, "dist-dev")

const config: webpack.Configuration = {
	mode: "development",
	devtool: "source-map",
	devServer: {
		historyApiFallback: true,
		hot: true,
		https: true,
		overlay: true,
		inline: true,
		port: 3010,
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	},
	entry: [
		// https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
		"core-js/modules/es.promise",
		"core-js/modules/es.array.iterator",

		// IE 10 polyfills required by react-dom. https://reactjs.org/docs/javascript-environment-requirements.html
		"core-js/es/map",
		"core-js/es/set",

		INDEX_JS_FILE
	],
	output: {
		filename: "js/[name]-[hash].js",
		chunkFilename: "js/[name]-[hash].js",
		publicPath: "https://localhost:3010/",
		path: DIST_FOLDER
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx"],
		alias: {
			"react-dom": "@hot-loader/react-dom" // https://github.com/gaearon/react-hot-loader#hot-loaderreact-dom
		}
	},
	module: {
		rules: [
			{ // https://github.com/gaearon/react-hot-loader#typescript
				exclude: /node_modules/,
				test: /\.(t|j)sx?$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							cacheDirectory: CACHE,
							babelrc: false,
							presets: [
								// Adds dynamic imports of the necessary polyfills (see .browserslistrc for spec)
								["@babel/preset-env", {
									useBuiltIns: "usage",
									corejs: { version: 3, proposals: true }
								}],
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
			{ // Parses non-modular scss files
				test: /\.global\.s?css$/,
				exclude: /node_modules/,
				use: [
					"style-loader",
					"css-loader",
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								outputStyle: "compressed",
								includePaths: [
									path.resolve(NODE_MODULES_FOLDER, "@veracity/js-internal/themes", THEME)
								]
							}
						}
					}
				]
			},
			{ // Parses modular scss files
				exclude: /\.global\.s?css$/,
				test: /\.s?css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1, // How many loaders should be applied to imported resources before this one
							modules: true
						}
					},
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								outputStyle: "compressed",
								includePaths: [
									path.resolve(NODE_MODULES_FOLDER, "@veracity/js-internal/themes", THEME)
								]
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
			tsconfig: path.resolve(ROOT_FOLDER, "tsconfig.json")
			// tslint: true // No need for tslinting on dev. Just takes extra time
		})
	]
}

export default config
