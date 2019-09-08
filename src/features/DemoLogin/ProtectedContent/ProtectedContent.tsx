import React from "react"
import { inputValueExtractor } from "../../../utils/inputHelpers"
import { IMessage } from "../IDemoLoginState"

export interface IProtectedContentValues {
	currentMessage: string
	messages: IMessage[]
}
export interface IProtectedContentHandlers {
	onCurrentMessageChange: (newMessage: string) => any
	sendMessage: () => any
}
export interface IProtectedContentProps extends IProtectedContentValues, IProtectedContentHandlers { }

import styles from "./ProtectedContent.scss"

const preventDefault = (callback: any) => (evt: any) => {
	evt.preventDefault()
	callback()
}
const ctrlClick = (callback: any) => (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
	if (evt.key === "Enter" && evt.ctrlKey === true) {
		callback()
	}
}

export const ProtectedContent: React.FunctionComponent<IProtectedContentProps> =
	({currentMessage, onCurrentMessageChange, messages, sendMessage}) => {
	return (
		<div className={styles.container}>
			<table className={styles.message}>
				<tbody>
					{messages.map(({timestamp, author, message}) => (
						<tr key={timestamp}>
							<td>
								{timestamp}<br/>{author}
							</td>
							<td>{message}</td>
						</tr>
					))}
				</tbody>
			</table>
			<form className={styles.newMessage} action="GET" onSubmit={preventDefault(sendMessage)}>
				<textarea autoFocus
					value={currentMessage}
					onChange={inputValueExtractor(onCurrentMessageChange)}
					onKeyUp={ctrlClick(sendMessage)}/>
				<br/><button>Send</button>
			</form>
		</div>
	)
}
ProtectedContent.defaultProps = {
	messages: []
}
export default ProtectedContent
