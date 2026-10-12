'use client'

import type { Tool } from 'sanity'
import { IntentLink, useRouterState, useStateLink } from 'sanity/router'

import type { GuideAction } from './content-utils'
import HelpGuide, { type ArticleLinkProps } from './HelpGuide'
import styles from './help.module.css'

export interface HelpOptions {
	supportEmail?: string
}

function ArticleLink({ id, fragment, onClick, ...props }: ArticleLinkProps) {
	const link = useStateLink({ state: { article: id } })
	return (
		<a
			{...props}
			href={fragment ? `${link.href}#${fragment}` : link.href}
			onClick={(event) => {
				onClick?.(event)
				if (!fragment && !event.defaultPrevented) link.onClick(event)
			}}
		/>
	)
}

function EditorLink({ action }: { action: GuideAction }) {
	return (
		<IntentLink
			intent={action.intent}
			params={action.params}
			className={styles.actionLink}
		>
			{action.label}
			<span aria-hidden="true"> →</span>
		</IntentLink>
	)
}

export default function HelpTool({ tool }: { tool: Tool<HelpOptions> }) {
	const articleId = useRouterState((state) =>
		typeof state.article === 'string' ? state.article : 'start',
	)
	return (
		<HelpGuide
			articleId={articleId}
			ArticleLink={ArticleLink}
			EditorLink={EditorLink}
			supportEmail={tool.options?.supportEmail}
		/>
	)
}
