import { TimelineItem } from '@/components/shared/TimelineItem'
import type { MilestoneItem } from '@/types'

interface TimelineEntry {
	title: string
	milestones: MilestoneItem[]
}

export function TimelineSection({ timelines }: { timelines: TimelineEntry[] }) {
	return (
		<div className="flex flex-col gap-4 pt-16 text-black md:flex-row">
			{timelines?.map((timeline) => {
				const { title, milestones } = timeline
				const timelineKey = `${title ?? 'timeline'}-${milestones?.length ?? 0}`
				return (
					<div className="max-w-[80%] md:max-w-[50%]" key={timelineKey}>
						<div className="pb-5 font-sans text-xl font-bold">{title}</div>

						{milestones?.map((experience, index) => {
							const milestoneKey = `${experience?.title ?? 'milestone'}-${index}`
							return (
								<div key={milestoneKey}>
									<TimelineItem
										milestone={experience}
										isLast={(milestones?.length ?? 0) - 1 === index}
									/>
								</div>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
