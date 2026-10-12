import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import PostsPage, {
	type PostsPageSearchParams,
} from '@/components/pages/posts/PostsPage'
import { loadAllPosts } from '@/sanity/loader/loadQuery'

const PostsPagePreview = dynamic(
	() => import('@/components/pages/posts/PostsPagePreview'),
)

export default async function PostsRoute({
	searchParams,
}: {
	searchParams?: Promise<PostsPageSearchParams>
}) {
	const [initial, params] = await Promise.all([loadAllPosts(), searchParams])
	if ((await draftMode()).isEnabled)
		return <PostsPagePreview initial={initial} searchParams={params} />
	return <PostsPage data={initial.data} searchParams={params} />
}
