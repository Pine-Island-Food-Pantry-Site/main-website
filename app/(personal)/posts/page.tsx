import { toPlainText } from '@portabletext/react'
import { GetStaticProps } from 'next'

import { PostPageProps } from '@/components/pages/post/PostPage'
import { allPostsQuery } from '@/sanity/lib/queries'

import { client } from '../../../sanity/lib/client'

interface Post {
  title: string
  _id: string
  coverImage: string
  description: string
  overview: string
  slug: string
}

interface Props {
  posts: Post[]
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
  console.log(toPlainText(posts[0].overview))
  return (
    <div>
      <h1>All Posts</h1>
      {posts.map((post, index) => (
        <div key={index}>
          <h2>{post.title}</h2>
          <p>{toPlainText(post.overview)}</p>
        </div>
      ))}
    </div>
  )
}

// export const getStaticProps: GetStaticProps<Props> = async () => {
//   // Fetch posts from Sanity
//   const response = await client.fetch(allPostsQuery)

//   const posts: Post[] = response.map((post: any) => ({
//     title: post?.title,
//     _id: post._id,
//     coverImage: post.coverImage,
//     description: toPlainText(post.overview),
//     overview: post.overview,
//     slug: post.slug.current,
//   }))

//   return {
//     props: {
//       posts,
//     },
//   }
// }
