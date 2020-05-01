import { connect } from "react-redux"
import { dispatchAction } from "utils/connectorHelpers"
import UserPassword, {
	IUserPasswordHandlers,
	IUserPasswordValues
} from "./UserPassword"

import * as duck from "../demoLogin.duck"

export default connect(
	(state): IUserPasswordValues => ({
		isLoggingIn: duck.isAuthenticating(state),
		isLoginFailed: duck.isAuthenticationFailed(state),
		username: duck.getUsername(state),
		password: duck.getPassword(state)
	}),
	(dispatch): IUserPasswordHandlers => ({
		login: dispatchAction(dispatch)(duck.doLogin),
		setUsername: dispatchAction(dispatch)(duck.setUsername),
		setPassword: dispatchAction(dispatch)(duck.setPassword)
	})
)(UserPassword)
