/**
 * This module is only used to store the storeManager in a standalone module so that we avoid
 * having to import from App and having cyclic dependencies.
 */

import { StoreManager } from "utils/StoreManager"

export const storeManager = new StoreManager()
export const getStore = () => storeManager.store
