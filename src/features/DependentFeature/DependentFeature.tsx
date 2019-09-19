import React from "react"

interface IDependentFeatureProps {
	isAuthenticated: boolean
	changeLogin: () => void
}

export const DependentFeature: React.FunctionComponent<IDependentFeatureProps> = ({isAuthenticated, changeLogin}) => {
	return (
		<div>
			This feature has a dependency on another feature that must be injected.
			{isAuthenticated ? <p>Authenticated</p> : <p>Not authenticated</p>}
			<button onClick={changeLogin}>Login</button>
		</div>
	)
}
export default DependentFeature
