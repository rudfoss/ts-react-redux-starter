/**
 * A small function that returns incremented unique values fom an set of provided characters
 * @param alphabet
 */
export const newStringIncrementor = (
	alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) => {
	const chars = alphabet.split("")
	const alphabetLength = chars.length
	const segmentIndices: number[] = [-1]

	const incrementIndices = (from: number) => {
		const newIndex = segmentIndices[from] + 1
		if (newIndex >= alphabetLength) {
			segmentIndices[from] = 0
			if (from > 0) {
				incrementIndices(from - 1)
			} else if (from <= 0) {
				segmentIndices.push(0)
			}
			return
		}
		segmentIndices[from] = newIndex
	}

	return () => {
		incrementIndices(segmentIndices.length - 1)
		return segmentIndices.map((idx) => chars[idx]).join("")
	}
}
