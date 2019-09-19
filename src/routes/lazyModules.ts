import { importChunk } from "utils/codeSplitHelpers"
import { StoreManager } from "utils/StoreManager"

/**
 * This function is where you define your route chunks.
 * Add one line for each component and use the `importChunk` helper to automatically add reducers, sagas
 * and redux middleware to the store once the module loads.
 */
export const lazyModules = (storeManager: StoreManager) => ({
	DemoLogin: importChunk(storeManager)(() => import(/* webpackChunkName: "DemoLogin" */ "features/DemoLogin")),
	DependentFeature: importChunk(storeManager)(() => import(/* webpackChunkName: "DependentFeature" */ "features/DependentFeature"))
})
