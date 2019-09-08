import { createAction, handleActions } from "redux-actions"
import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects"
import { IDuckExport } from "../../interfaces"
import { authenticate } from "./demoLogin.api"
import { IDemoLoginState } from "./IDemoLoginState"

const _ns = "demoLogin"
export const getState = (state: any): IDemoLoginState => state[_ns] || {}
const action = (name: string, payload?: any) => createAction(`${_ns}/${name}`, payload) as any

export const getUsername = (state: any) => getState(state).username || ""
export const getPassword = (state: any) => getState(state).password || ""
export const setUsername = action("SET_USERNAME")
export const setPassword = action("SET_PASSWORD")

export const getMessages = (state: any) => getState(state).messages || []
export const getCurrentMessage = (state: any) => getState(state).currentMessage || ""
export const setCurrentMessage = action("SET_CURRENT_MESSAGE")
const insertMessage = action("INSERT_MESSAGE", (author: string, timestamp: number, message: string) =>
	({author, timestamp, message})) // This is not a public action and is only used by internals

export const isAuthenticated = (state: any) => getState(state).authenticated || false
export const isAuthenticating = (state: any) => getState(state).authenticating || false
export const isAuthenticationFailed = (state: any) => getState(state).authenticationFailed || false
export const setIsAuthenticating = action("SET_IS_AUTHENTICATING", (flag: boolean = true) => flag)
export const setIsAuthenticated = action("SET_IS_AUTHENTICATED", (flag: boolean = true) => flag)
export const setIsAuthenticationFailed = action("SET_IS_AUTHENTICATIONFAILED", (flag: boolean = true) => flag)

export const doLogin = action("LOGIN")

function* login() {
	yield put(setIsAuthenticated(false))
	yield put(setIsAuthenticating())

	const username = yield select(getUsername)
	const password = yield select(getPassword)

	const authenticated = yield call(authenticate, username, password)
	yield put(setIsAuthenticationFailed(!authenticated))
	yield put(setIsAuthenticated(authenticated))
	yield put(setIsAuthenticating(false))
}
export const sendMessage = action("ADD_MESSAGE")
function* sendMessageSaga() {
	const message = yield select(getCurrentMessage)

	if (!message) return

	const username = yield select(getUsername)
	const timestamp = Date.now()
	yield put(setCurrentMessage(""))
	yield put(insertMessage(username, timestamp, message))
}

function* saga() {
	yield takeLeading(doLogin, login)
	yield takeEvery(sendMessage, sendMessageSaga)
}

const reducer = handleActions({
	[setUsername.toString()]: (state, {payload}: any): IDemoLoginState => ({
		...state,
		username: payload
	}),
	[setPassword.toString()]: (state, {payload}: any): IDemoLoginState => ({
		...state,
		password: payload
	}),

	[setIsAuthenticated.toString()]: (state, {payload}: any): IDemoLoginState => ({
		...state,
		authenticated: payload
	}),
	[setIsAuthenticating.toString()]: (state, {payload}: any): IDemoLoginState => ({
		...state,
		authenticating: payload
	}),
	[setIsAuthenticationFailed.toString()]: (state, {payload}: any): IDemoLoginState => ({
		...state,
		authenticationFailed: payload
	}),

	[setCurrentMessage.toString()]: (state, {payload}: any): IDemoLoginState => ({
		...state,
		currentMessage: payload
	}),
	[insertMessage.toString()]: (state: IDemoLoginState, {payload}: any): IDemoLoginState => ({
		...state,
		messages: (state.messages || []).concat(payload)
	})
}, {})

export const duck: IDuckExport = {
	[_ns]: {
		saga,
		reducer
	}
}

export default reducer
