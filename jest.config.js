const fs = require("fs")
const path = require("path")

let config = {}
// tslint:disable-next-line: no-eval
eval(
	`config = ${fs.readFileSync(
		path.resolve(__dirname, "tsconfig.json"),
		"UTF8"
	)}`
)
const { compilerOptions } = config

const aliases = {}
for (const entry of Object.entries(compilerOptions.paths || {})) {
	const [alias, relativePath] = entry
	const jestAlias = `^${alias.replace("/*", "")}(.*)$`
	const jestPath = `${path.resolve(
		compilerOptions.baseUrl,
		relativePath[0].replace("/*", "")
	)}$1`
	aliases[jestAlias] = jestPath
}

module.exports = {
	preset: "ts-jest",
	bail: 1,
	moduleNameMapper: {
		"^.+\\.(css|less|scss)$": "identity-obj-proxy",
		...aliases
	}
}
