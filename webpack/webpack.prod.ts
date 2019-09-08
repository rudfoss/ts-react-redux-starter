import path from "path"
import webpack from "webpack"

import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import HtmlPlugin from "html-webpack-plugin"
import MiniCSSExtractPlugin from "mini-css-extract-plugin"
import TerserPlugin from "terser-webpack-plugin"

const THEME = (process.env.THEME || "light") + "/" // Which theme to use for js-internal
const CACHE = false // Control caching for all rules/plugins and optimizers

// TODO: Make dynamic
const ROOT_FOLDER = path.resolve(__dirname, "../")
const NODE_MODULES_FOLDER = path.resolve(ROOT_FOLDER, "../node_modules")
const SRC_FOLDER = path.resolve(ROOT_FOLDER, "src")
const INDEX_JS_FILE = path.resolve(SRC_FOLDER, "index.ts")
const INDEX_HTML_FILE = path.resolve(SRC_FOLDER, "index.html")
const DIST_FOLDER = path.resolve(ROOT_FOLDER, "dist")

const config: webpack.Configuration = {
	mode: "production",
	devtool: "source-map",
	entry: [
		// https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
		"core-js/modules/es.promise",
		"core-js/modules/es.array.iterator",

		// IE 10 polyfills required by React.
		"core-js/es/map",
		"core-js/es/set",

		INDEX_JS_FILE
	],
	optimization: {
		namedChunks: true,
		runtimeChunk: "multiple",
		minimize: true,
		minimizer: [
			new TerserPlugin({
				sourceMap: true,
				cache: CACHE
			})
		],
		splitChunks: {
			chunks: "all"
		}
	},
	output: {
		filename: "js/[name]-[contenthash].js",
		chunkFilename: "js/[name]-[contenthash].js",
		path: DIST_FOLDER
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx"]
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
							presets: [
								// Adds dynamic imports of the necessary polyfills (see .browserslistrc for spec)
								["@babel/preset-env", {
									useBuiltIns: "usage",
									corejs: { version: 3, proposals: true },
									debug: true
								}],
								"@babel/preset-typescript",
								"@babel/preset-react"
							],
							plugins: [
								["@babel/plugin-proposal-class-properties", { loose: true }],
								"@babel/plugin-transform-runtime"// , // Adds support for async/await in older browsers
								// "react-hot-loader/babel"
							]
						}
					}
				]
			},
			{ // Parses non-modular scss files
				test: /\.global\.s?css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCSSExtractPlugin.loader
					},
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
					{
						loader: MiniCSSExtractPlugin.loader
					},
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
			minify: {
				collapseBooleanAttributes: true,
				collapseWhitespace: true,
				keepClosingSlash: true,
				removeRedundantAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}
		}),
		new MiniCSSExtractPlugin({
			filename: "styles/[name]-[contenthash].css",
			chunkFilename: "styles/[name]-[contenthash].css"
		}),
		new ForkTSCheckerPlugin({
			tsconfig: path.resolve(ROOT_FOLDER, "tsconfig.json"),
			tslint: true
		})
	]
}

export default config
