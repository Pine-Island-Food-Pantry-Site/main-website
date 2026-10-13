import type { EncodeDataAttributeCallback } from '@sanity/react-loader'

import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { Header } from '@/components/shared/Header'
import type { PagePayload } from '@/types'

export interface PageProps {
	data: PagePayload | null
	encodeDataAttribute?: EncodeDataAttributeCallback
}

export function Page({ data, encodeDataAttribute }: PageProps) {
	// Default to an empty object to allow previews on non-existent documents
	const { body, overview, title } = data ?? {}

	return (
		<div>
			<div className="mb-14">
				{/* Header */}
				<Header title={title} description={overview} />

				{/* Body */}
				{body && (
					<div data-sanity={encodeDataAttribute?.('body')}>
						<CustomPortableText
							paragraphClasses="themed-muted-text font-serif max-w-3xl text-xl"
							value={body}
						/>
					</div>
				)}
			</div>
			<div className="absolute left-0 w-screen border-t" />
		</div>
	)
}

export default Page
