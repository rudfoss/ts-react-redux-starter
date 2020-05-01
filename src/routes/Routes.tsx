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
const { DemoLogin, DependentFeature } = lazyModules(storeManager)

export const Routes: React.FC = () => (
	<RouteErrorBoundary>
		<Link to="/">Home</Link>
		<Suspense fallback={<LoadingRoute />}>
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/dependent" exact>
					<DependentFeature />
				</Route>
				<Route path="/protected">
					<DemoLogin />
				</Route>
				<Route>
					<NotFoundRoute />
				</Route>
			</Switch>
		</Suspense>
	</RouteErrorBoundary>
)

export default Routes
