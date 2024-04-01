import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    overview,
    showcaseProjects[]->{
      _type,
      coverImage,
      overview,
      "slug": slug.current,
      tags,
      title,
    },
    title,
  }
`

export const pagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    body,
    overview,
    title,
    "slug": slug.current,
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    coverImage,
    description,
    duration,
    overview,
    "slug": slug.current,
    tags,
    title,
  }
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    footer,
    menuItems[]->{
      _type,
      "slug": slug.current,
      title
    },
    ogImage,
  }
`

// groq query to get the latest post
export const latestPostQuery = groq`
  *[_type == "post"] | order(duration.publishedAt desc) [0] {
    _id,
    coverImage,
    description,
    duration,
    overview,
    "slug": slug.current,
    tags,
    title,
  }
`

// groq query to get all posts
export const allPostsQuery = groq`
  *[_type == "post"] | order(duration.publishedAt desc) {
    _id,
    coverImage,
    description,
    duration,
    overview,
    "slug": slug.current,
    tags,
    title,
  }
`
