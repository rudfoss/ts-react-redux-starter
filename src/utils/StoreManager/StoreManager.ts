import {
	applyMiddleware,
	combineReducers,
	compose,
	createStore,
	Middleware,
	Reducer,
	Store
} from "redux"
import { ReduxCompatibleReducer } from "redux-actions"
import createSagaMiddleware, { SagaMiddleware } from "redux-saga"
import { IDuckExport } from "../../interfaces"

/**
 * Small helper class that manages the redux store object allowing for dynamic insertion
 * of reducers and sagas.
 */
export class StoreManager {
	public get store() {
		if (!this._store) {
			throw new Error("You must call createStore() on this instance before you can get the store.")
		}
		return this._store
	}
	public get state() {
		return this.store.getState()
	}
	public get dispatch() {
		return this.store.dispatch
	}

	private _store?: Store
	/**
	 * Map of all loaded reducers
	 */
	private reducers: {[key: string]: Reducer | ReduxCompatibleReducer<any, any>}  = {}
	/**
	 * Contains a list of all imported sagas.
	 */
	private sagas: {[key: string]: GeneratorFunction} = {}

	/**
	 * Keys to remove from the state on the next dispatch
	 */
	private reducerKeysToRemove: string[] = []
	private combinedReducer: Reducer = ((state: any) => state)
	private allMiddleware: {
		saga: SagaMiddleware,
		[key: string]: Middleware
	}
	private get sagaMiddleware() {
		return this.allMiddleware.saga
	}

	public constructor() {
		this.allMiddleware = {
			saga: createSagaMiddleware()
		}
	}

	/**
	 * Adds one or more reducer key/values to the reducer set
	 * @param newReducers The new reducers to add
	 */
	public addReducers(newReducers: {[key: string]: Reducer | ReduxCompatibleReducer<any, any>}) {
		Object.assign(this.reducers, newReducers)
		this.recombineReducers()
	}
	/**
	 * Removes one or more reducers by key from the reducer set
	 * @param keysToRemove The keys to remove from the set of reducers
	 */
	public removeReducers(keysToRemove: string | string[]) {
		const keys = Array.isArray(keysToRemove) ? keysToRemove : [keysToRemove]
		for (const key of keys) {
			if (!this.reducers[key]) {
				continue
			}
			delete this.reducers[key]
			this.reducerKeysToRemove.push(key)
		}

		this.recombineReducers()
	}
	/**
	 * Adds one or more sagas to the redux-saga set. Sagas cannot be removed.
	 * https://github.com/GuillaumeCisco/redux-sagas-injector/issues/2
	 * @param newSagasByKey
	 */
	public addSagas(newSagasByKey: {[key: string]: () => Generator}) {
		for (const sagaEntry of Object.entries(newSagasByKey)) {
			const [key, saga] = sagaEntry
			if (this.sagas[key]) {
				if (process.env.NODE_ENV === "development") {
					// tslint:disable-next-line: no-console
					console.warn(`A saga with key "${key}" already exists and was not added.`+
						"This may occur if the saga was added by multiple chunks or the hot-reload mechanism re-injects a "+
						"dynamically loaded component with sagas. If you did not change any of the sagas in the module you "+
						"can keep working, but if you did you must refresh the app for the saga to take effect.")
				}
				return
			}
			this.sagaMiddleware.run(saga)
			Object.assign(this.sagas, {[key]: saga})
		}
	}
	/**
	 * Adds one or more duck key/value objects into the store.
	 * @param newDucks
	 */
	public addDucks(newDucks: IDuckExport) {
		const reducersByKey: {[key: string]: Reducer | ReduxCompatibleReducer<any, any>} = {}
		const sagasByKey: {[key: string]: () => Generator} = {}
		for (const duckEntry of Object.entries(newDucks)) {
			const [key, duck] = duckEntry
			if (duck.saga) {
				sagasByKey[key] = duck.saga
			}
			if (duck.reducer) {
				reducersByKey[key] = duck.reducer
			}
			if (duck.middleware) {
				this.addMiddleware(duck.middleware)
			}
		}

		if (Object.keys(reducersByKey).length > 0) {
			this.addReducers(reducersByKey)
		}
		if (Object.keys(sagasByKey).length > 0) {
			this.addSagas(sagasByKey)
		}
	}
	/**
	 * Add middleware to the store on the fly.
	 * Middleware cannot be removed as they may have side effects that cannot be properly cleaned up.
	 * @param middlewareByKey
	 */
	public addMiddleware(middlewareByKey: {[key: string]: Middleware}) {
		this.allMiddleware = {
			...this.allMiddleware,
			...middlewareByKey
		}
		this.initMiddleware(Object.values(middlewareByKey))
	}

	public createStore(initialState: {[key: string]: any} = {}) {
		if (this._store) {
			throw new Error("You can only create a store once. If you want to recreate it you must create "+
			"a new StoreManager instance.")
		}
		const devComposer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
		this._store = createStore(
			this.reducer, initialState, devComposer(applyMiddleware(this.middleware))
		)
		this.initMiddleware(Object.values(this.allMiddleware))
		return this.store
	}

	/**
	 * Proxy reducer to give to the store. Supports removing keys from the store thus cleaning up after removed reducers
	 */
	private reducer = (state: any, action: any) => {
		if (this.reducerKeysToRemove.length > 0) { // Clean out all removed data from the store
			for (const key of this.reducerKeysToRemove) {
				delete state[key]
			}
			this.reducerKeysToRemove = []
		}
		return this.combinedReducer(state, action) // Pass call to combined reducer
	}
	private middleware = (store: any) => (next: any) => (action: any) => {
		const chain = Object.values(this.allMiddleware).map((aMiddleware) => aMiddleware(store))
		return (compose(...chain) as any)(next)(action)
	}
	/**
	 * Rebuilds the reducer set. Must be called every time reducers are updated.
	 */
	private recombineReducers() {
		return this.combinedReducer = combineReducers(this.reducers)
	}
	/**
	 * Initializes all middleware by passing the store instance to them.
	 * @param middlewares
	 */
	private initMiddleware(middlewares: Middleware[]) {
		for (const middleware of middlewares) {
			middleware(this.store)
		}
	}
}

export default StoreManager
