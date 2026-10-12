import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import { HomePage } from '@/components/pages/home/HomePage'
import { loadLandingPage } from '@/sanity/loader/loadQuery'

const HomePagePreview = dynamic(
	() => import('@/components/pages/home/HomePagePreview'),
)

export default async function IndexRoute() {
	const initial = await loadLandingPage()
	if ((await draftMode()).isEnabled)
		return <HomePagePreview initial={initial} />
	return <HomePage data={initial.data} />
}
