import { importChunk } from "utils/codeSplitHelpers"
import { StoreManager } from "utils/StoreManager"

/**
 * This function is where you define your route chunks.
 * Add one line for each component and use the importChunk helper to ensure ducks are imported correctly
 */
export const lazyModules = (storeManager: StoreManager) => ({
	DemoLogin: importChunk(storeManager)(() => import(/* webpackChunkName: "DemoLogin" */ "features/DemoLogin"))
})
