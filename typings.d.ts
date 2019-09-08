/**
 * This tweak allows us to import x from "./style.scss" without errors
 */
declare module "*.scss" {
	const styles: {[className: string]: string}
	export default styles
}