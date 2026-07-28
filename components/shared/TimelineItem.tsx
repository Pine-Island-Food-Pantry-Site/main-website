import ImageBox from '@/components/shared/ImageBox'
import type { MilestoneItem } from '@/types'

export function TimelineItem({
	isLast,
	milestone,
}: {
	isLast: boolean
	milestone: MilestoneItem
}) {
	const { description, duration, image, tags, title } = milestone
	const startYear = duration?.start
		? new Date(duration.start).getFullYear()
		: undefined
	const endYear = duration?.end ? new Date(duration.end).getFullYear() : 'Now'

	return (
		<div className={`flex min-h-[200px] font-sans ${!isLast && 'pb-2'}`}>
			<div className="flex flex-col">
				{/* Thumbnail */}
				<div
					className="themed-image-background relative overflow-hidden rounded-md"
					style={{ width: '65px', height: '65px' }}
				>
					<ImageBox
						image={image}
						alt={title || 'Timeline item icon'}
						size="10vw"
						width={65}
						height={65}
					/>
				</div>
				{/* Vertical line */}
				{!isLast && (
					<div className="themed-divider mt-2 w-px grow self-center" />
				)}
			</div>
			<div className="flex-initial pl-4">
				{/* Title */}
				<div className="font-bold">{title}</div>
				{/* Tags */}
				<div className="themed-muted-text text-sm">
					{tags?.map((tag) => (
						<span key={tag}>
							{tag}
							<span className="mx-1">●</span>
						</span>
					))}
					{startYear} - {endYear}
				</div>
				{/* Description */}
				<div className="themed-muted-text pb-5 pt-3 font-serif">
					{description}
				</div>
			</div>
		</div>
	)
}
