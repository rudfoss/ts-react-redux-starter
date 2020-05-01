import React, { Suspense } from "react"
import LoadingRoute from "../LoadingRoute"
import UserPassword from "./UserPassword"

const ProtectedContent = React.lazy(() => import("./ProtectedContent"))

export interface IDemoLoginProps {
	isAuthenticated: boolean
}

export const DemoLogin: React.FC<IDemoLoginProps> = ({ isAuthenticated }) => (
	<Suspense fallback={<LoadingRoute />}>
		{isAuthenticated ? <ProtectedContent /> : <UserPassword />}
	</Suspense>
)
export default DemoLogin
