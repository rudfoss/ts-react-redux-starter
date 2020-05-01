import { ActionCreator, Dispatch } from "redux"
import { Action } from "redux-actions"

/**
 * A function that combines a dispather with an action creator and returns a new function that
 * will dispatch the result of calling the action creator with the provided arguments.
 *
 * This is intended to simplify passing action creator and dispatchers to event handlers within a
 * component.
 *
 * ```
 * const login = dispatchAction(dispatch)(duck.doLogin)
 * login({username, password}) // will dispatch the result of calling duck.doLogin({username, password})
 * ```
 */
export const dispatchAction = (dispatch: Dispatch<Action<any>>) => (
	actionCreator: ActionCreator<any>
) => (...args: any[]) => {
	dispatch(actionCreator(...args))
}
