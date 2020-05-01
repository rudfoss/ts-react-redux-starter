import { connect } from "react-redux"
import DemoLogin, { IDemoLoginProps } from "./DemoLogin"

import * as demoLoginDuck from "./demoLogin.duck"

export default connect(
	(state): IDemoLoginProps => ({
		isAuthenticated: demoLoginDuck.isAuthenticated(state)
	})
)(DemoLogin)
