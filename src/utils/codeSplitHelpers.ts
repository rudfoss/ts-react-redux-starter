import { ComponentType, lazy } from "react"
import { IDuckExport } from "../interfaces"
import { StoreManager } from "./StoreManager"

/**
 * This function helps define code splitting boundaries and ensures imported modules also
 * register their reducers and sagas.
 *
 * Example:
 * `importChunk(storeManager)(() => import(/* webpackChunkName. "chunkName" *\/""./Component"))`
 *
 * @param storeManager
 */
export const importChunk =
	<TComponent extends ComponentType<any>>(storeManager: StoreManager) =>
	(importer: (() => Promise<{ default: TComponent, duck?: IDuckExport }>)) =>
	lazy<TComponent>(async () => {
		const component = await importer()
		if (component.duck) {
			storeManager.addDucks(component.duck)
		}
		return component
	})
