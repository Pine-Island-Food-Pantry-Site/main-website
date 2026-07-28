'use client'

import { useEffect, useId, useState } from 'react'

import styles from './theme-switcher.module.css'

const THEME_STORAGE_KEY = 'theme-preference'
const themes = ['auto', 'light', 'dark'] as const

type ThemePreference = (typeof themes)[number]

function isThemePreference(value: string | null): value is ThemePreference {
	return themes.some((theme) => theme === value)
}

function applyTheme(theme: ThemePreference) {
	document.documentElement.dataset.theme = theme
	document.documentElement.style.colorScheme = theme === 'auto' ? '' : theme
}

export default function ThemeSwitcher() {
	const selectId = useId()
	const [theme, setTheme] = useState<ThemePreference>('auto')

	useEffect(() => {
		let savedTheme: string | null = null
		try {
			savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
		} catch {
			// Storage can be unavailable in privacy-restricted browser contexts.
		}
		const restoredTheme = isThemePreference(savedTheme) ? savedTheme : 'auto'

		setTheme(restoredTheme)
		applyTheme(restoredTheme)
	}, [])

	const handleThemeChange = (nextTheme: ThemePreference) => {
		setTheme(nextTheme)
		try {
			localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
		} catch {
			// The selected theme still applies for the current page.
		}
		applyTheme(nextTheme)
	}

	return (
		<div className={styles.theme_switcher}>
			<label className={styles.label} htmlFor={selectId}>
				Theme
			</label>
			<select
				aria-label="Color theme"
				className={styles.select}
				id={selectId}
				onChange={(event) =>
					handleThemeChange(event.target.value as ThemePreference)
				}
				title="Choose a color theme"
				value={theme}
			>
				<option value="auto">Auto</option>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
	)
}
