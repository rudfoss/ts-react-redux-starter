/**
 * This tweak allows us to import x from "./style.scss" without errors
 */
declare module "*.scss" {
	const styles: { [className: string]: string }
	export default styles
}

/**
 * Similar to the module above this allows us to import any json file without issues.
 */
declare module "*.json" {
	const value: any
	export default value
}
