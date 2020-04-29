// tslint:disable: no-console

import path from "path"
import webpack, { DefinePlugin } from "webpack"

import HtmlPlugin from "html-webpack-plugin"
import autoprefixer from "autoprefixer"
import MiniCSSExtractPlugin from "mini-css-extract-plugin"
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin"
import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"

import { tsConfigPathsToWebpackAliases } from "./tsConfigPathsToWebpackAliases"
import { newStringIncrementor } from "./stringIncrementor"

const getLocalIdent = newStringIncrementor() // Produces the shortest possible unique string for class-names
const CACHE_ENABLED = false // Control caching for all rules/plugins and optimizers

const ROOT_FOLDER = path.resolve(__dirname, "../")
const SRC_FOLDER = path.resolve(ROOT_FOLDER, "src")
const INDEX_JS_FILE = path.resolve(SRC_FOLDER, "index.ts")
const INDEX_HTML_FILE = path.resolve(SRC_FOLDER, "index.html")
const DIST_FOLDER = path.resolve(ROOT_FOLDER, "dist")
const TS_CONFIG_PATH = path.resolve(ROOT_FOLDER, "tsconfig.json")

// This logs autoprefixer settings so that they can be verified
console.log("========= AUTOPREFIXER ==========")
console.log((autoprefixer as any).info())
console.log("========= /AUTOPREFIXER ==========")

export default async () => {
	const alias = await tsConfigPathsToWebpackAliases(TS_CONFIG_PATH)

	const config: webpack.Configuration = {
		mode: "production",
		devtool: "source-map",

		entry: [
			// https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
			"core-js/modules/es.promise",
			"core-js/modules/es.array.iterator",

			INDEX_JS_FILE,
		],

		optimization: {
			namedChunks: true,
			runtimeChunk: "multiple",
			minimize: true,
			minimizer: [
				new TerserPlugin({
					sourceMap: true,
					cache: CACHE_ENABLED,
				}),
				new OptimizeCssAssetsPlugin({
					cssProcessorPluginOptions: {
						preset: ["default", { discardComments: { removeAll: true } }],
					},
				}),
			],
			splitChunks: {
				chunks: "all",
			},
		},

		output: {
			// https://medium.com/@sahilkkrazy/hash-vs-chunkhash-vs-contenthash-e94d38a32208
			filename: "js/[name]-[contenthash].js",
			chunkFilename: "js/[name]-[contenthash].js",
			path: DIST_FOLDER,
		},

		resolve: {
			extensions: [".js", ".ts", ".tsx"],
			alias,
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
								presets: [
									[
										"@babel/preset-env", // Adds dynamic imports of the necessary polyfills (see .browserslistrc for spec)
										{
											useBuiltIns: "usage",
											corejs: { version: 3, proposals: true },
											debug: true,
										},
									],
									"@babel/preset-typescript",
									"@babel/preset-react",
								],
								plugins: [
									["@babel/plugin-proposal-class-properties", { loose: true }],
									"@babel/plugin-transform-runtime", // , // Adds support for async/await in older browsers
								],
							},
						},
					],
				},
				{
					// Parses non-modular scss files
					test: /\.global\.s?css$/,
					exclude: /node_modules/,
					use: [
						{
							loader: MiniCSSExtractPlugin.loader,
						},
						"css-loader",
						{
							loader: "postcss-loader",
							options: {
								plugins: [autoprefixer],
							},
						},
						{
							loader: "sass-loader",
							options: {
								sassOptions: {
									outputStyle: "compressed",
								},
							},
						},
					],
				},
				{
					// Parses modular scss files
					exclude: /\.global\.s?css$/,
					test: /\.s?css$/,
					use: [
						{
							loader: MiniCSSExtractPlugin.loader,
						},
						{
							loader: "css-loader",
							options: {
								importLoaders: 2, // How many loaders should be applied to imported resources before this one
								modules: {
									getLocalIdent,
								},
							},
						},
						{
							loader: "postcss-loader",
							options: {
								plugins: [autoprefixer],
							},
						},
						{
							loader: "sass-loader",
							options: {
								sassOptions: {
									outputStyle: "compressed",
								},
							},
						},
					],
				},
			],
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
					useShortDoctype: true,
				},
			}),
			new MiniCSSExtractPlugin({
				filename: "styles/[name]-[contenthash].css",
				chunkFilename: "styles/[name]-[contenthash].css",
			}),
			new ForkTSCheckerPlugin({
				tsconfig: TS_CONFIG_PATH,
			}),
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify("development"),
			}),
		],
	}

	return config
}
