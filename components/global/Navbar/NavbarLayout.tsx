import Image from 'next/image'
import Link from 'next/link'

import styles from '../../../styles/navbar.module.css'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'

export default function Navbar() {
	return (
		<nav aria-label="Primary navigation" className={styles.navbar_main}>
			<div className={styles.navbar_logo}>
				<Link href="/" className={styles.image}>
					<Image
						src={'/logo.svg'}
						alt={'Pine Island Logo'}
						width={183}
						height={116}
						loading="eager"
						style={{ width: '80px', height: 'auto' }}
					/>
				</Link>
				<p className={styles.nav_text}>Pine Island Food Pantry</p>
			</div>
			<a
				href="https://www.paypal.com/donate?hosted_button_id=45JBRR8VRXJ76"
				className={styles.link_styles}
				target="_blank"
				rel="noopener"
			>
				Donate
			</a>
			<Link href="/about" className={styles.link_styles}>
				About Us
			</Link>
			<Link href="/contact" className={styles.link_styles}>
				Contact
			</Link>
			<ThemeSwitcher />
		</nav>
	)
}
