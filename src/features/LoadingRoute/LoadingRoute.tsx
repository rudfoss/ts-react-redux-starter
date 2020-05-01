import React, { useEffect, useState } from "react"

const renderDots = (dotCount: number, dot = ".") => dot.repeat(dotCount)

export const LoadingRoute: React.FC = () => {
	const [dots, setDots] = useState(1)

	useEffect(() => {
		const timer = setTimeout(() => setDots((dots + 1) % 50), 50)
		return () => clearTimeout(timer)
	})

	return (
		<div style={{ textAlign: "center" }}>
			{renderDots(dots)} Loading {renderDots(dots)}
		</div>
	)
}
export default LoadingRoute
