'use client'

import type { QueryResponseInitial } from '@sanity/react-loader'

import { allPostsQuery } from '@/sanity/lib/queries'
import { useQuery } from '@/sanity/loader/useQuery'
import type { PostPayload } from '@/types'

import PostsPage, { type PostsPageSearchParams } from './PostsPage'

export default function PostsPagePreview({
	initial,
	searchParams,
}: {
	initial: QueryResponseInitial<PostPayload[]>
	searchParams?: PostsPageSearchParams
}) {
	const { data, encodeDataAttribute } = useQuery<PostPayload[]>(
		allPostsQuery,
		{},
		{ initial },
	)
	return (
		<PostsPage
			data={data}
			searchParams={searchParams}
			encodeDataAttribute={encodeDataAttribute}
		/>
	)
}
