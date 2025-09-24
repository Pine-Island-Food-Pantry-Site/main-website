import { ArrowRightIcon } from '@sanity/icons'
import { Box, Flex, Text } from '@sanity/ui'
import { useCallback, useMemo } from 'react'
import {
	FieldMember,
	MemberField,
	ObjectInputProps,
	RenderFieldCallback,
} from 'sanity'

export function DurationInput(props: ObjectInputProps) {
	const { members, renderInput, renderItem, renderPreview } = props

	const fieldMembers = useMemo(
		() => members.filter((mem) => mem.kind === 'field') as FieldMember[],
		[members],
	)

	const pubDate = fieldMembers.find((mem) => mem.name === 'publishedAt')

	const renderField: RenderFieldCallback = useCallback(
		(props) => props.children,
		[],
	)

	const renderProps = useMemo(
		() => ({ renderField, renderInput, renderItem, renderPreview }),
		[renderField, renderInput, renderItem, renderPreview],
	)

	return (
		<Flex align="center" gap={3}>
			<Box flex={1}>
				{pubDate && <MemberField {...renderProps} member={pubDate} />}
			</Box>
			<ArrowRightIcon />
		</Flex>
	)
}
