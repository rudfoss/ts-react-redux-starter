import { Middleware, Reducer } from "redux"
import { ReduxCompatibleReducer } from "redux-actions"

/**
 * Defines the core functions of a duck file. You should provide either saga or reducer or both.
 */
export interface IDuck<TState = any, TAction = any> {
	/**
	 * The redux-saga generator function if applicable.
	 */
	saga?: () => Generator
	/**
	 * The root reducer for this duck if applicable.
	 */
	reducer?: Reducer | ReduxCompatibleReducer<TState, TAction>
	/**
	 * Add any additional middleware used by this module
	 */
	middleware?: { [key: string]: Middleware }
}
