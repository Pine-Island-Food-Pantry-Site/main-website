import 'server-only'

import { experimental_taintUniqueValue } from 'react'

export const token = process.env.SANITY_API_READ_TOKEN

if (token) {
	experimental_taintUniqueValue(
		'Do not pass the sanity API read token to the client.',
		process,
		token,
	)
}
