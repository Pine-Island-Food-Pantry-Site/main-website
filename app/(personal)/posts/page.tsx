import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import PostsList from '@/components/Posts/PostsList'
import SearchForm from '@/components/Posts/SearchForm'
import Pagination from '@/components/Posts/Pagination'
import { allPostsQuery } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import styles from '@/styles/posts.module.css'
import type { PortableTextBlock } from '@portabletext/types'
import type { Image as SanityImage } from 'sanity'
import { toPlainText } from '@portabletext/react'

// Shape returned by Sanity for the list query (only fields we read)
interface SanityPostDoc {
	_id: string
	title?: string
	coverImage?: SanityImage
	overview?: PortableTextBlock[]
	slug: { current: string }
}

interface Post {
	title: string
	_id: string
	coverImage?: SanityImage
	description: string
	slug: string
}

type PostsPageSearchParams = {
	search?: string | string[]
	page?: string | string[]
}

const PAGE_SIZE = 6

function normalizeSearchParam(value?: string | string[]): string {
	if (!value) return ''
	const rawValue = Array.isArray(value) ? value[0] : value
	return rawValue.trim()
}

function normalizePageParam(value?: string | string[]): number {
	if (!value) return 1
	const rawValue = Array.isArray(value) ? value[0] : value
	const parsed = Number.parseInt(rawValue, 10)
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

async function getPosts(): Promise<Post[]> {
	try {
		const data = await client.fetch<SanityPostDoc[]>(allPostsQuery)
		return data.map((post) => {
			const overviewBlocks = post?.overview ?? []
			return {
				title: post?.title || '',
				_id: post._id,
				coverImage: post?.coverImage,
				description:
					overviewBlocks.length > 0 ? toPlainText(overviewBlocks) : '',
				slug: post?.slug?.current || '',
			}
		})
	} catch (error) {
		console.error('Error fetching posts:', error)
		return []
	}
}

export default async function PostsPage({
	searchParams,
}: {
	searchParams?: Promise<PostsPageSearchParams>
}) {
	const posts = await getPosts()
	const resolvedSearchParams = await searchParams
	const searchTerm = normalizeSearchParam(resolvedSearchParams?.search)
	const normalizedSearch = searchTerm.toLowerCase()
	const filteredPosts = normalizedSearch
		? posts.filter((post) => {
				const title = post.title.toLowerCase()
				const description = post.description.toLowerCase()
				return (
					title.includes(normalizedSearch) ||
					description.includes(normalizedSearch)
				)
			})
		: posts

	const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
	const requestedPage = normalizePageParam(resolvedSearchParams?.page)
	const currentPage = Math.min(requestedPage, totalPages)
	const startIndex = (currentPage - 1) * PAGE_SIZE
	const paginatedPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE)

	return (
		<div className={styles.posts_page}>
			<h1 className={styles.h1_text}>Welcome to The Pine Island Food Pantry</h1>
			<h2 className={styles.h2_text}>
				Providing food assistance for those in need.
			</h2>
			<div className={styles.image_div}>
				<Image
					src={'/logo.svg'}
					alt="Pine Island Food Pantry Logo"
					fill={true}
					sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw"
				/>
			</div>
			<a
				href="https://maps.app.goo.gl/DTgw8M5Lgby9eFvY6"
				className={styles.top_link}
			>
				12175 Stringfellow Road Bokeelia, FL 33922 USA
			</a>
			<a
				className={styles.donate_button}
				href="https://www.paypal.com/donate?hosted_button_id=45JBRR8VRXJ76"
				target="_blank"
				rel="noopener"
			>
				Donate
			</a>
			<div className={`food_background ${styles.food_card}`}>
				<div className={styles.inner_card}>
					<h3 className={styles.h3_text}>Our Posts</h3>
					<h4 className={styles.h4_text}>Newest First or</h4>
					<Suspense fallback={<div>Loading...</div>}>
						<SearchForm />
					</Suspense>
					<PostsList posts={paginatedPosts} />
					<Suspense fallback={<div>Loading...</div>}>
						<Pagination totalPages={totalPages} currentPage={currentPage} />
					</Suspense>
				</div>
			</div>
			<Link className={styles.contact_button} href="/contact">
				Contact Us
			</Link>
		</div>
	)
}
