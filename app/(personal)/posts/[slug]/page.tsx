import { toPlainText } from '@portabletext/react'
import { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { PostPage } from '@/components/pages/post/PostPage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadPost } from '@/sanity/loader/loadQuery'
const PostPreview = dynamic(() => import('@/components/pages/post/PostPreview'))

type Props = {
	params: Promise<{ slug: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
	{ params: paramsPromise, searchParams: searchParamsPromise }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const params = await paramsPromise
	// const searchParams = await searchParamsPromise; // Await if used
	const { data: post } = await loadPost(params.slug)
	const ogImage = urlForOpenGraphImage(post?.coverImage)

	return {
		title: post?.title,
		description: post?.overview
			? toPlainText(post.overview)
			: (await parent).description,
		openGraph: ogImage
			? {
					images: [ogImage, ...((await parent).openGraph?.images || [])],
				}
			: {},
	}
}

export function generateStaticParams() {
	return generateStaticSlugs('post')
}

export default async function ProjectSlugRoute({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: Promise<{ slug: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const params = await paramsPromise
	// const searchParams = await searchParamsPromise; // Await if used
	const initial = await loadPost(params.slug)

	if ((await draftMode()).isEnabled) {
		return <PostPreview params={params} initial={initial} /> // Ensure PostPreview expects params as { slug: string }, not Promise
	}

	if (!initial.data) {
		notFound()
	}

	return <PostPage data={initial.data} />
}
