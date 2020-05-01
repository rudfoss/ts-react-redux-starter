import * as demoLoginDuck from "features/DemoLogin" // Import the feature we depend upon
import { createAction, handleActions } from "redux-actions"
import { IDuckExport } from "interfaces"

interface IDependentFeatureState {
	data?: any
}

const _ns = "namespace"
export const getState = (state: any): IDependentFeatureState => state[_ns] || {}
const action = (name: string, payload?: any) =>
	createAction(`${_ns}/${name}`, payload) as any

export const getData = (state: any) => getState(state).data || undefined
export const setState = action("SET_STATE")

const reducer = handleActions(
	{
		[setState.toString()]: (state, { payload }) => ({
			...state,
			data: payload
		})
	},
	{}
)

export const duck: IDuckExport = {
	[_ns]: {
		reducer
	},
	...demoLoginDuck.duck
}

export const demoLogin = demoLoginDuck // Expose the imported duck for external connectors

export default reducer
