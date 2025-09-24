import { toPlainText } from '@portabletext/react'
import { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Page } from '@/components/pages/page/Page'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadPage } from '@/sanity/loader/loadQuery'
const PagePreview = dynamic(() => import('@/components/pages/page/PagePreview'))

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
	const { data: page } = await loadPage(params.slug)

	return {
		title: page?.title,
		description: page?.overview
			? toPlainText(page.overview)
			: (await parent).description,
	}
}

export function generateStaticParams() {
	return generateStaticSlugs('page')
}

export default async function PageSlugRoute({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: Promise<{ slug: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const params = await paramsPromise
	// const searchParams = await searchParamsPromise; // Await if used
	const initial = await loadPage(params.slug)

	if ((await draftMode()).isEnabled) {
		return <PagePreview params={params} initial={initial} /> // Ensure PagePreview expects params as { slug: string }, not Promise
	}

	if (!initial.data) {
		notFound()
	}

	return <Page data={initial.data} />
}
