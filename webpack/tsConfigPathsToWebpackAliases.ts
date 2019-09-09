import fs from "fs"
import path from "path"
import { promisify } from "util"

const pExists = promisify(fs.exists)
const pRead = promisify(fs.readFile)

interface ITSConfig {
	compilerOptions: {
		baseUrl?: string
		paths?: {
			[alias: string]: string[]
		}
	}
}

/**
 * This script imports "paths" configurations as aliases in webpack so that you don't have
 * to configure it twice.
 * @param tsConfigPath The path to the tsconfig file to resolve
 * @param [baseUrl] The base url to use when parsing (will use tsconfig baseUrl if not specified)
 */
export const tsConfigPathsToWebpackAliases = async (tsConfigPath: string, baseUrl?: string) => {
	const fullPath = path.resolve(tsConfigPath)
	const base = path.dirname(fullPath)

	if (!await pExists(fullPath)) {
		throw new Error(`No such tsconfig file "${fullPath}"`)
	}
	// tslint:disable-next-line: prefer-const
	let content: ITSConfig = {compilerOptions:{}}
	// tslint:disable-next-line: no-eval
	eval(`content = ${await pRead(fullPath, "UTF8")}`)
	const {compilerOptions} = content
	// tslint:disable-next-line: no-console

	const aliasBaseUrl = path.resolve(base, (baseUrl || compilerOptions.baseUrl || "./"))
	const aliases: {[key: string]: string} = {}

	for (const aliasEntry of Object.entries(compilerOptions.paths || {})) {
		const [alias, relativePath] = aliasEntry
		aliases[alias.replace("/*", "")] = path.resolve(aliasBaseUrl, relativePath[0].replace("/*", ""))
	}

	return aliases
}

tsConfigPathsToWebpackAliases(path.resolve(__dirname, "../tsconfig.json")).catch((error) => {
	// tslint:disable-next-line: no-console
	console.error(error)
	process.exit(1)
})
