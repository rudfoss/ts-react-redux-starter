import { lazy } from "react"
import { StoreManager } from "./StoreManager"

export const importChunk =
	(storeManager: StoreManager) =>
	(importer: any) =>
	lazy(async () => {
		const component = await importer()
		if (component.duck) {
			storeManager.addDucks(component.duck)
		}
		return component
	})
