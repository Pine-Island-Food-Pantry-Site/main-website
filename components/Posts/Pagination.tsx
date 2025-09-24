'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import styles from '@/styles/posts.module.css'

interface PaginationProps {
	totalPages: number
	currentPage: number
}

function buildPageHref(searchTerm: string, pageNumber: number) {
	const params = new URLSearchParams()
	if (searchTerm) {
		params.set('search', searchTerm)
	}
	if (pageNumber > 1) {
		params.set('page', String(pageNumber))
	}
	const queryString = params.toString()
	return queryString ? `/posts?${queryString}` : '/posts'
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
	const searchParams = useSearchParams()
	const searchTerm = searchParams.get('search') || ''

	if (totalPages <= 1) {
		return null
	}

	return (
		<nav className={styles.pagination} aria-label="Posts pagination">
			<Link
				className={`${styles.pagination_button} ${
					currentPage === 1 ? styles.pagination_button_disabled : ''
				}`}
				href={buildPageHref(searchTerm, Math.max(1, currentPage - 1))}
				aria-disabled={currentPage === 1}
				aria-label="Previous page"
			>
				Prev
			</Link>
			<ul className={styles.pagination_list}>
				{Array.from({ length: totalPages }).map((_, index) => {
					const pageNumber = index + 1
					const isActive = pageNumber === currentPage
					return (
						<li key={pageNumber}>
							<Link
								className={`${styles.pagination_button} ${
									isActive ? styles.pagination_button_active : ''
								}`}
								href={buildPageHref(searchTerm, pageNumber)}
								aria-current={isActive ? 'page' : undefined}
							>
								{pageNumber}
							</Link>
						</li>
					)
				})}
			</ul>
			<Link
				className={`${styles.pagination_button} ${
					currentPage === totalPages
						? styles.pagination_button_disabled
						: ''
				}`}
				href={buildPageHref(
					searchTerm,
					Math.min(totalPages, currentPage + 1),
				)}
				aria-disabled={currentPage === totalPages}
				aria-label="Next page"
			>
				Next
			</Link>
		</nav>
	)
}
