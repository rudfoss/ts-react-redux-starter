import React, { ErrorInfo } from "react"

interface IRouteErrorBoundaryState {
	error?: Error
}

/**
 * A generic component for rendering errors within routes.
 */
export class RouteErrorBoundary extends React.PureComponent<
	{},
	IRouteErrorBoundaryState
> {
	private get errorMessage() {
		const { error } = this.state
		if (!error) return "no error"
		return `Url: ${window.location.href}
${error.message}
${error.stack}`
	}

	public static getDerivedStateFromError(error: Error) {
		return { error }
	}

	public state: IRouteErrorBoundaryState = {}
	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Error rendering route", error, errorInfo)
	}

	public render() {
		if (!this.state.error) {
			return this.props.children
		}

		return (
			<div>
				<h1>A routing error occurred</h1>
				<p>
					A routing error has occurred while attempting to display a component.{" "}
					<a href="/" aria-label="Return to the home page">
						Click here
					</a>{" "}
					to go back to the home page and try again.
				</p>
				<hr />
				<h2>Technical details</h2>
				<sub>Please include this information when contacting support</sub>
				<pre>
					<code>{this.errorMessage}</code>
				</pre>
			</div>
		)
	}
}
export default RouteErrorBoundary
