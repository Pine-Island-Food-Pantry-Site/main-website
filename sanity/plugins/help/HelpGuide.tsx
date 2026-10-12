'use client'

import { SearchIcon } from '@sanity/icons/Search'
import { Button, Card, TextInput } from '@sanity/ui'
import {
	type AnchorHTMLAttributes,
	type ComponentType,
	useEffect,
	useRef,
	useState,
} from 'react'
import Markdown from 'react-markdown'

import articleData from './articles.generated.json'
import {
	findGuideArticles,
	type GuideAction,
	type GuideArticle,
	guideLink,
	headingId,
} from './content-utils'
import styles from './help.module.css'

export interface ArticleLinkProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
	id: string
	fragment?: string
}

interface HelpGuideProps {
	articleId?: string
	ArticleLink: ComponentType<ArticleLinkProps>
	EditorLink: ComponentType<{ action: GuideAction }>
	supportEmail?: string
}

const articles: GuideArticle[] = articleData as GuideArticle[]
const categories = [...new Set(articles.map(({ category }) => category))]
const quickStart = [
	'posts',
	'manage-posts',
	'images',
	'publishing',
	'settings',
	'checklist',
]

export default function HelpGuide({
	articleId = 'start',
	ArticleLink,
	EditorLink,
	supportEmail,
}: HelpGuideProps) {
	const [query, setQuery] = useState('')
	const [navigationOpen, setNavigationOpen] = useState(false)
	const article = articles.find(({ id }) => id === articleId)
	const results = findGuideArticles(articles, query)
	const searching = query.trim().length > 0
	const headingRef = useRef<HTMLHeadingElement>(null)
	const previousArticle = useRef(articleId)
	const mainRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const fragment = window.location.hash.slice(1)
		if (fragment) document.getElementById(fragment)?.scrollIntoView()
		else mainRef.current?.scrollTo({ top: 0 })
		if (previousArticle.current !== articleId)
			headingRef.current?.focus({ preventScroll: window.innerWidth > 640 })
		previousArticle.current = articleId
	}, [articleId])

	return (
		<Card style={{ height: '100%', minHeight: 0 }}>
			<div className={styles.shell}>
				<a className={styles.skipLink} href="#guide-content">
					Skip to guide content
				</a>
				<Card as="aside" borderRight className={styles.sidebar}>
					<div className={styles.sidebarHeading}>
						<span className={styles.eyebrow}>Pine Island Food Pantry</span>
						<h2>Help &amp; Guide</h2>
						<p>Your handbook for website updates.</p>
					</div>
					<label className={styles.searchLabel} htmlFor="guide-search">
						Search the guide
					</label>
					<TextInput
						id="guide-search"
						type="search"
						icon={SearchIcon}
						value={query}
						placeholder="Try photos or publishing"
						onChange={(event) => setQuery(event.currentTarget.value)}
					/>
					{searching ? (
						<div className={styles.searchResults}>
							<p role="status" className={styles.resultCount}>
								{results.length} {results.length === 1 ? 'article' : 'articles'}{' '}
								found
							</p>
							{results.length ? (
								<nav aria-label="Guide search results">
									{results.map((result) => (
										<ArticleLink
											key={result.id}
											id={result.id}
											className={styles.resultLink}
											aria-current={
												result.id === articleId ? 'page' : undefined
											}
											onClick={() => setQuery('')}
										>
											<strong>{result.title}</strong>
											<span>{result.summary}</span>
										</ArticleLink>
									))}
								</nav>
							) : (
								<p>
									No articles match “{query.trim()}”. Try a shorter phrase, such
									as “photo”, “slug”, or “publish”.
								</p>
							)}
							<Button
								mode="ghost"
								text="Clear search"
								onClick={() => setQuery('')}
							/>
						</div>
					) : (
						<>
							<button
								type="button"
								className={styles.navToggle}
								aria-expanded={navigationOpen}
								aria-controls="guide-navigation"
								onClick={() => setNavigationOpen((open) => !open)}
							>
								{navigationOpen
									? 'Close article list'
									: `Browse all ${articles.length} guides`}
							</button>
							<nav
								id="guide-navigation"
								className={styles.navigation}
								data-open={navigationOpen}
								aria-label="Guide articles"
							>
								{categories.map((category) => (
									<div className={styles.navGroup} key={category}>
										<h3>{category}</h3>
										{articles
											.filter((item) => item.category === category)
											.map((item) => (
												<ArticleLink
													key={item.id}
													id={item.id}
													className={styles.navLink}
													aria-current={
														item.id === articleId ? 'page' : undefined
													}
													onClick={() => setNavigationOpen(false)}
												>
													{item.title}
												</ArticleLink>
											))}
									</div>
								))}
							</nav>
						</>
					)}
				</Card>
				<main
					className={styles.main}
					ref={mainRef}
					id="guide-content"
					tabIndex={-1}
				>
					{article ? (
						<article className={styles.article}>
							<header className={styles.articleHeader}>
								<span className={styles.eyebrow}>{article.category}</span>
								<h1 ref={headingRef} tabIndex={-1}>
									{article.title}
								</h1>
								<p className={styles.summary}>{article.summary}</p>
								<p className={styles.updated}>
									Guide updated{' '}
									<time dateTime={article.updatedAt}>
										{new Date(
											`${article.updatedAt}T00:00:00Z`,
										).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											timeZone: 'UTC',
										})}
									</time>
								</p>
								{article.action ? (
									<div className={styles.editorAction}>
										<EditorLink action={article.action} />
									</div>
								) : null}
							</header>
							{article.id === 'start' ? (
								<div className={styles.quickStart}>
									{quickStart.map((id) => {
										const item = articles.find((entry) => entry.id === id)
										return item ? (
											<ArticleLink
												id={id}
												key={id}
												className={styles.quickLink}
											>
												<strong>
													{item.title}
													<span
														className={styles.quickArrow}
														aria-hidden="true"
													>
														{' '}
														↗
													</span>
												</strong>
												<span>{item.summary}</span>
											</ArticleLink>
										) : null
									})}
								</div>
							) : null}
							<nav className={styles.contents} aria-label="On this page">
								<h2>On this page</h2>
								{article.headings.map((heading) => (
									<a key={heading.id} href={`#${heading.id}`}>
										{heading.title}
									</a>
								))}
							</nav>
							<div className={styles.prose}>
								<Markdown
									skipHtml
									components={{
										h2: ({ children }) => (
											<h2 id={headingId(String(children))}>{children}</h2>
										),
										a: ({ href = '', children }) => {
											const target = guideLink(href)
											return target ? (
												<ArticleLink {...target}>{children}</ArticleLink>
											) : (
												<a
													href={href}
													target="_blank"
													rel="noopener noreferrer"
												>
													{children}
													<span className={styles.srOnly}>
														{' '}
														(opens in a new tab)
													</span>
												</a>
											)
										},
									}}
								>
									{article.markdown}
								</Markdown>
							</div>
							<footer className={styles.support}>
								<h2>Need a hand?</h2>
								{supportEmail ? (
									<p>
										Contact your website maintainer at{' '}
										<a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
									</p>
								) : (
									<p>
										Contact the person who maintains your website or gave you
										Studio access.
									</p>
								)}
								<ArticleLink id="troubleshooting">
									Find troubleshooting steps and what to include when asking for
									help.
								</ArticleLink>
							</footer>
						</article>
					) : (
						<div className={styles.article}>
							<h1 ref={headingRef} tabIndex={-1}>
								Guide article not found
							</h1>
							<p>
								This article may have moved. Search the guide or return to the
								start page.
							</p>
							<ArticleLink id="start">Return to Start here</ArticleLink>
						</div>
					)}
				</main>
			</div>
		</Card>
	)
}
