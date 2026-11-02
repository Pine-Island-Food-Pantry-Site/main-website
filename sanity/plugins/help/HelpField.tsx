import { Box, Text } from '@sanity/ui'
import type { FieldProps } from 'sanity'
import { IntentLink } from 'sanity/router'

export function helpField(description: string, article: string) {
	// biome-ignore lint/correctness/noComponentHookFactories: called once at schema-definition time, never during render, so each component identity is stable
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
