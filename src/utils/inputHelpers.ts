import React from "react"

/**
 * Creates a function that takes event.target.value and passes it as the first argument to the callback.
 * Intended for use as onChange handlers for input elements.
 * @param callback The function that should receive the value
 */
export const inputValueExtractor = <TValue = string>(
	callback: (value: TValue) => any
) => (evt: React.ChangeEvent<any>) => {
	callback(evt.target.value)
}
