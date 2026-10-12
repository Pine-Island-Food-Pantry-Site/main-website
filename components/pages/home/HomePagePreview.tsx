'use client'

import type { QueryResponseInitial } from '@sanity/react-loader'

import { latestPostQuery } from '@/sanity/lib/queries'
import { useQuery } from '@/sanity/loader/useQuery'
import type { LandingPagePayload } from '@/types'

import HomePage from './HomePage'

type Props = {
	initial: QueryResponseInitial<LandingPagePayload | null>
}

export default function HomePagePreview(props: Props) {
	const { initial } = props
	const { data, encodeDataAttribute } = useQuery<LandingPagePayload | null>(
		latestPostQuery,
		{},
		{ initial },
	)

	return <HomePage data={data} encodeDataAttribute={encodeDataAttribute} />
}
