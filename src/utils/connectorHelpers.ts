import { ActionCreator, Dispatch } from "redux"
import { Action } from "redux-actions"

/**
 * Given a dispatcher and an actionCreator will return another function that, when called,
 * dispatches the result of calling the action creater and passing all arguments to it.
 */
export const dispatchAction =
	(dispatch: Dispatch<Action<any>>) =>
	(actionCreator: ActionCreator<any>) =>
	(...args: any[]) => {
	dispatch(actionCreator(...args))
}
