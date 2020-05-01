import { connect } from "react-redux"
import DependentFeature from "./DependentFeature"

import * as ducks from "./dependentFeature.duck"

export default connect(
	(state) => ({
		isAuthenticated: ducks.demoLogin.isAuthenticated(state)
	}),
	(dispatch) => ({
		changeLogin: () => {
			dispatch(ducks.demoLogin.setIsAuthenticated(true))
		}
	})
)(DependentFeature)
