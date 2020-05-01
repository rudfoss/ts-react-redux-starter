/**
 * Super secure user database
 */
const userDB: { [name: string]: string } = {
	admin: "pass123",
	guest: "pass456"
}

const delay = (delayMs: number, resolveWith: any = true) =>
	new Promise((resolve) => {
		setTimeout(() => resolve(resolveWith), delayMs)
	})

export const authenticate = async (username: string, password: string) => {
	await delay(1000)
	return userDB[username] === password
}
