import prodConfig from "./webpack.prod"

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

export default async () => {
	const config = await prodConfig()

	config.plugins?.push(new BundleAnalyzerPlugin())

	return config
}
