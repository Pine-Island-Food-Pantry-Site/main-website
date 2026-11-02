'use client'

import type { QueryResponseInitial } from '@sanity/react-loader'

import { allPostsQuery } from '@/sanity/lib/queries'
import { useQuery } from '@/sanity/loader/useQuery'
import type { PostListItemPayload } from '@/types'

import PostsPage, { type PostsPageSearchParams } from './PostsPage'

export default function PostsPagePreview({
	initial,
	searchParams,
}: {
	initial: QueryResponseInitial<PostListItemPayload[]>
	searchParams?: PostsPageSearchParams
}) {
	const { data, encodeDataAttribute } = useQuery<PostListItemPayload[]>(
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
