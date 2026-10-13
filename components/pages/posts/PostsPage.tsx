import { toPlainText } from '@portabletext/react'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Image from 'next/image'
import Link from 'next/link'
import { stegaClean } from 'next-sanity'
import { Suspense } from 'react'
import Pagination from '@/components/Posts/Pagination'
import PostsList from '@/components/Posts/PostsList'
import SearchForm from '@/components/Posts/SearchForm'
import styles from '@/styles/posts.module.css'
import type { PostPayload } from '@/types'

export type PostsPageSearchParams = {
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

export default function PostsPage({
	data,
	searchParams: resolvedSearchParams,
	encodeDataAttribute,
}: {
	data: PostPayload[]
	searchParams?: PostsPageSearchParams
	encodeDataAttribute?: EncodeDataAttributeCallback
}) {
	const posts = data.map((post, sourceIndex) => ({
		_id: post._id,
		sourceIndex,
		title: post.title || '',
		coverImage: post.coverImage,
		description: stegaClean(toPlainText(post.overview || [])),
		slug: stegaClean(post.slug || ''),
	}))
	const searchTerm = normalizeSearchParam(resolvedSearchParams?.search)
	const normalizedSearch = searchTerm.toLowerCase()
	const filteredPosts = normalizedSearch
		? posts.filter((post) => {
				const title = stegaClean(post.title).toLowerCase()
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
					loading="eager"
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
					<PostsList
						posts={paginatedPosts}
						encodeDataAttribute={encodeDataAttribute}
					/>
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
