import { Box, Text } from '@sanity/ui'
import type { FieldProps } from 'sanity'
import { IntentLink } from 'sanity/router'

export function helpField(description: string, article: string) {
	function HelpField(props: FieldProps) {
		return (
			<>
				{props.renderDefault(props)}
				<Box paddingTop={2}>
					<Text size={1}>
						<IntentLink intent="help" params={{ article }}>
							Read the guide for {props.title || 'this field'}
						</IntentLink>
					</Text>
				</Box>
			</>
		)
	}
	return { description, components: { field: HelpField } }
}
