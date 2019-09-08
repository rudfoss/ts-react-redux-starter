import { IDuck } from "./IDuck"

/**
 * Defines what the "duck" export from a feature should look like.
 */
export interface IDuckExport {
	[key: string]: IDuck
}
