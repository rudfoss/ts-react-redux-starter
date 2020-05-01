// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hot } = require("react-hot-loader/root") // must do it this way because typings are incorrect

import React from "react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { storeManager } from "store"
import { StoreManager } from "utils/StoreManager"
import Routes from "./routes"

import "./App.global.scss"

const anyWindow = window as any

export class App extends React.PureComponent<
	{},
	{ internalMessage: string; showModule: boolean }
> {
	public storeManager: StoreManager

	public get environment() {
		return process.env.NODE_ENV // This is set by webpack so it is safe, even for the browser
	}

	public constructor(props: {}) {
		super(props)
		this.storeManager = storeManager
		this.storeManager.createStore({})
		anyWindow.app = this
	}

	public render() {
		return (
			<Provider store={this.storeManager.store}>
				<BrowserRouter>
					<Routes />
				</BrowserRouter>
			</Provider>
		)
	}
}
export default hot(App)
