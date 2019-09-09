import { importChunk } from "utils/codeSplitHelpers"
import { StoreManager } from "utils/StoreManager"

export const lazyModules = (storeManager: StoreManager) => ({
	DemoLogin: importChunk(storeManager)(() => import(/* webpackChunkName: "DemoLogin" */ "features/DemoLogin"))
})
