import { toPlainText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

import { allPostsQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/utils'

import { client } from '../../../sanity/lib/client'
import styles from '../../../styles/posts.module.css'

interface Post {
  title: string
  _id: string
  coverImage: string
  description: string
  overview: string
  slug: string
}

async function getPosts() {
  client
    .fetch(allPostsQuery)
    .then((data) => {
      const posts: Post[] = data.map((post: any) => ({
        title: post?.title,
        _id: post._id,
        coverImage: post.coverImage,
        description: toPlainText(post.overview),
        overview: post.overview,
        slug: post.slug.current,
      }))

      return posts
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  return client.fetch(allPostsQuery)
}

export default async function PostsPage() {
  const posts = await getPosts()

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
      >
        Donate
      </a>
      <div className={`food_background ${styles.food_card}`}>
        <div className={styles.inner_card}>
          <h3 className={styles.h3_text}>Our Posts</h3>
          <h4 className={styles.h4_text}>Newest First</h4>
          {posts.map((post, index) => {
            const imageUrl =
              post.coverImage &&
              urlForImage(post.coverImage)
                ?.height(250)
                .width(250)
                .fit('crop')
                .url()

            return (
              <div key={index} className={styles.card}>
                <div className={styles.card_image}>
                  <Image src={imageUrl} alt={post.title} fill={true} />
                </div>
                <h4 className={styles.post_h4}>{post.title}</h4>
                <p className={styles.card_text}>
                  {toPlainText(post.overview).substring(0, 100)}
                </p>
                <Link className={styles.card_link} href={`/posts/${post.slug}`}>
                  Read More
                </Link>
              </div>
            )
          })}
        </div>
      </div>
      <Link className={styles.contact_button} href="/contact">
        Contact Us
      </Link>
    </div>
  )
}
