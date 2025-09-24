'use client'

import Link from 'next/link'
import { useId } from 'react'
import { useSearchParams } from 'next/navigation'

import styles from '@/styles/posts.module.css'

export default function SearchForm() {
	const searchParams = useSearchParams()
	const searchId = useId()
	const searchTerm = searchParams.get('search') || ''

	return (
		<form className={styles.search_form} action="/posts" method="get">
			<label className={styles.search_label} htmlFor={searchId}>
				Search Posts
			</label>
			<div className={styles.search_controls}>
				<input
					className={styles.search_input}
					type="search"
					id={searchId}
					name="search"
					defaultValue={searchTerm}
					placeholder="Search by title or overview"
				/>
				<button className={styles.search_button} type="submit">
					Search
				</button>
				{searchTerm ? (
					<Link className={styles.clear_search} href="/posts">
						Clear Search
					</Link>
				) : null}
			</div>
		</form>
	)
}
