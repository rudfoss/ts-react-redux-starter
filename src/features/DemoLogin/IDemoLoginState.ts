export interface IMessage {
	timestamp: number
	author: string
	message: string
}

interface IDemoLoginStateFields {
	username: string
	password: string

	authenticating: boolean
	authenticationFailed: boolean
	authenticated: boolean

	currentMessage: string
	messages: IMessage[]
}

export type IDemoLoginState = Partial<IDemoLoginStateFields>
