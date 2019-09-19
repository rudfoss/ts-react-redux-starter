import Home from "features/Home"
import LoadingRoute from "features/LoadingRoute"
import NotFoundRoute from "features/NotFoundRoute/NotFoundRoute"
import RouteErrorBoundary from "features/RouteErrorBoundary"
import React, { Suspense } from "react"
import { Route, Switch } from "react-router"
import { Link } from "react-router-dom"
import { storeManager } from "store"
import { lazyModules } from "./lazyModules"

// Here you add a reference to each chunked feature you want to route to.
const {
	DemoLogin,
	DependentFeature
} = lazyModules(storeManager)

export class Routes extends React.Component {
	public render() {
		return (
			<RouteErrorBoundary>
				<Link to="/">Home</Link>
				<Suspense fallback={<LoadingRoute/>}>
					<Switch>
						<Route path="/" exact component={Home}/>
						<Route path="/dependent" exact component={DependentFeature}/>
						<Route path="/protected" component={DemoLogin}/>
						<Route component={NotFoundRoute}/>
					</Switch>
				</Suspense>
			</RouteErrorBoundary>
		)
	}
}

export default Routes
