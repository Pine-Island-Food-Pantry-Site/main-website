import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Link from 'next/link'

import { PostListItem } from '@/components/pages/home/PostListItem'
import { Header } from '@/components/shared/Header'
import { resolveHref } from '@/sanity/lib/utils'
import type { HomePagePayload } from '@/types'

export interface HomePageProps {
	data: HomePagePayload | null
	encodeDataAttribute?: EncodeDataAttributeCallback
}

export function HomePage({ data, encodeDataAttribute }: HomePageProps) {
	// Default to an empty object to allow previews on non-existent documents
	const { overview = [], posts = [], title = '' } = data ?? {}

	return (
		<div className="space-y-20">
			{/* Header */}
			{title && <Header centered title={title} description={overview} />}
			{/* Showcase projects */}
			{posts && posts.length > 0 && (
				<div className="mx-auto max-w-[100rem] rounded-md border">
					{posts.map((post, index) => {
						const slugValue =
							typeof post?.slug === 'string' ? post.slug : post?.slug?.current
						const postKey =
							post?._id ?? slugValue ?? post?.title ?? `post-${index}`
						const href = resolveHref(post?._type, slugValue)
						if (!href) {
							return null
						}
						return (
							<Link
								key={postKey}
								href={href}
								data-sanity={encodeDataAttribute?.(['Posts', postKey, 'slug'])}
							>
								<PostListItem post={post} odd={index % 2} />
							</Link>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default HomePage
