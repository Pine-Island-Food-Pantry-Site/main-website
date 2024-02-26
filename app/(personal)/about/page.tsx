import Image from 'next/image'
import Link from 'next/link'

import ContactCard from '@/components/global/ContactCard'

import styles from '../../../styles/about.module.css'

const About: React.FC = () => {
  return (
    <main className={styles.about_container}>
      <h1 className={styles.header_1}>
        Welcome to The Pine Island Food Pantry
      </h1>
      <h2 className={styles.header_2}>
        Providing food assistance for those in need
      </h2>
      <Image
        src={'logo.svg'}
        alt="Pine Island Food Pantry Logo"
        width={200}
        height={200}
      />
      <a
        className={styles.a_address}
        href="https://maps.app.goo.gl/DTgw8M5Lgby9eFvY6"
      >
        12175 Stringfellow Road Bokeelia, FL 33922 USA
      </a>
      {/* about us card button */}
      <div className={styles.about_us_card}>
        <h3 className={styles.header_3}>About Us</h3>
        <p className={styles.p_about_us_text}>
          The Pine Island Food Pantry is a non-denominational, 501c3 non-profit
          organization serving the residents of Pine Island and the greater
          Matlacha area and is open Mondays and Thursdays from 9am to 11am.
          Clients may pick up groceries twice per month. The pantry is housed in
          the Life Center of Our Lady of the Miraculous Medal Church at 12175
          Stringfellow Rd, Bokeelia, FL 33922.
          <br></br>
          <br></br>
          New clients are welcome. An ID is required at each visit to verify
          residency in our service area. Food amounts are distributed by family
          size and ages. Groceries include milk, eggs, sliced cheese, baked
          goods, canned goods, pasta, meat, toilet paper and bar soap. Other
          personal care grooming and hygiene products, as well as pet food and
          baby products are also frequently available.
        </p>
        <button className={styles.contact_button}>
          <Link href={'home'}>Contact Us</Link>{' '}
        </button>
      </div>
      {/* additional resources with links below  */}
      <div className={styles.additional_resources}>
        <h3 className={styles.header_3}>Additional Resources</h3>
        <a
          className={styles.a_additional_resources}
          href="https://communitycooperative.com/what-we-do/mobile-food-pantries/"
        >
          Community Cooperative - Upcoming Mobile Food Pantries
        </a>
        <a
          className={styles.a_additional_resources}
          href="https://harry-chapin-food-bank-mp.glideapp.io/dl/de6ccd"
        >
          Harry Chapin - Upcoming Mobile Food Pantries
        </a>
        <a
          className={styles.a_additional_resources}
          href="https://beaconofhopepineisland.com/"
        >
          Beacon of Hope (United Way Agency)
        </a>
        <a
          className={styles.a_additional_resources}
          href="https://pineislandfish.org/"
        >
          Pine Island F.I.S.H.
        </a>
        <a
          className={styles.a_additional_resources}
          href="https://www.matlachahookers.org/"
        >
          Matlacha Hookers 🐟
        </a>
        <a
          className={styles.a_additional_resources}
          href="https://www.pineislandmethodist.com/"
        >
          Pine Island United Methodist Church
        </a>
        <a
          className={styles.a_additional_resources}
          href="https://www.pineislandcommunitychurch.com/"
        >
          Pine Island Community Church
        </a>
        <a
          className={styles.a_additional_resources}
          href="https://www.pineislandchamber.org/"
        >
          Greater Pine Island Chamber of Commerce
        </a>
      </div>
      <ContactCard />
    </main>
  )
}

export default About
