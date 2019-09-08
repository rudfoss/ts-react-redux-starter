import { connect } from "react-redux"
import ProtectedContent, { IProtectedContentHandlers, IProtectedContentValues } from "./ProtectedContent"

import { dispatchAction } from "../../../utils/connectorHelpers"
import * as demoLogin from "../demoLogin.duck"

export default connect((state): IProtectedContentValues => ({
	currentMessage: demoLogin.getCurrentMessage(state),
	messages: demoLogin.getMessages(state)
}), (dispatch): IProtectedContentHandlers => ({
	onCurrentMessageChange: dispatchAction(dispatch)(demoLogin.setCurrentMessage),
	sendMessage: dispatchAction(dispatch)(demoLogin.sendMessage)
}))(ProtectedContent)
