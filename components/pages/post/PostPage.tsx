import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Image from 'next/image'
import Link from 'next/link'

import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { Header } from '@/components/shared/Header'
import ImageBox from '@/components/shared/ImageBox'
import type { PostPayload } from '@/types'

import styles from '../../../styles/single_post.module.css'

export interface PostPageProps {
  data: PostPayload | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export function PostPage({ data, encodeDataAttribute }: PostPageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { coverImage, description, duration, overview, tags, title } =
    data ?? {}

  const year = duration
    ? new Date(duration).getFullYear()
    : new Date().getFullYear()

  return (
    <div>
      <div className={styles.page}>
        <h1 className={styles.h1_text}>
          Welcome to The Pine Island Food Pantry
        </h1>
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
        <div className={`food_background ${styles.outer_card}`}>
          <div className={styles.inner_card}>
            <div className={styles.image_container}>
              {/* Image  */}
              <ImageBox
                data-sanity={encodeDataAttribute?.('coverImage')}
                image={coverImage}
                // @TODO add alt field in schema
                alt=""
                classesWrapper={styles.image_container}
              />

              <div className="divide-inherit grid grid-cols-1 divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0">
                {/* Tags */}
                <div className="p-3 lg:p-4">
                  <div className="text-xs md:text-sm">Tags</div>
                  <div className="text-md flex flex-row flex-wrap md:text-lg">
                    {tags?.map((tag, key) => (
                      <div key={key} className="mr-1 break-words ">
                        #{tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className={styles.title}>{title}</h1>

            {/* Description */}
            {description && (
              <CustomPortableText
                paragraphClasses={styles.description}
                value={description}
              />
            )}
          </div>
        </div>
        <Link className={styles.posts_page_link} href="/posts">
          Back To Posts
        </Link>
      </div>

      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}

export default PostPage
