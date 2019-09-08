// tslint:disable: max-line-length
import React from "react"
import { Link } from "react-router-dom"

export const Home: React.FunctionComponent<{}> = () => {
	return (
		<>
			<h1>Welcome to the TS-React-Redux-Starter-Project</h1>
			<p>This project is set up with a lot of pre-configured features to optimize your workflow. Check the readme to get started.</p>
			<p>Click <Link to="/protected">here</Link> to test the code splitting demo (watch the Network tab in your browses dev-tools)</p>
		</>
	)
}
export default Home
