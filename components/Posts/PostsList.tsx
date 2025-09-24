import Image from 'next/image'
import Link from 'next/link'
import type { Image as SanityImage } from 'sanity'

import { urlForImage } from '@/sanity/lib/utils'
import styles from '@/styles/posts.module.css'

interface Post {
	title: string
	_id: string
	coverImage?: SanityImage
	description: string
	slug: string
}

interface PostsListProps {
	posts: Post[]
}

export default function PostsList({ posts }: PostsListProps) {
	if (posts.length === 0) {
		return (
			<p className={styles.empty_state}>
				No posts found. Try adjusting your search.
			</p>
		)
	}

	return (
		<>
			{posts.map((post) => {
				const imageUrl = post.coverImage
					? urlForImage(post.coverImage)
							?.height(200)
							.width(200)
							.fit('crop')
							.url()
					: undefined

				return (
					<div key={post._id} className={styles.card}>
						<div className={styles.card_image}>
							{imageUrl ? (
								<Image
									src={imageUrl}
									alt={post.title || 'Default post cover image'}
									fill={true}
								/>
							) : null}
						</div>
						<h4 className={styles.post_h4}>{post.title}</h4>
						<p className={styles.card_text}>
							{post.description
								? `${post.description.slice(0, 100)}${
										post.description.length > 100 ? '…' : ''
								  }`
								: 'Read more to learn about this update.'}
						</p>
						<Link className={styles.card_link} href={`/posts/${post.slug}`}>
							Read More
						</Link>
					</div>
				)
			})}
		</>
	)
}
