import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import ContactCard from '@/components/global/ContactCard'
import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { studioUrl } from '@/sanity/lib/api'
import { client } from '@/sanity/lib/client'
import { latestPostQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/utils'
import { loadLandingPage } from '@/sanity/loader/loadQuery'

import styles from '../../styles/landing.module.css'
const HomePagePreview = dynamic(
  () => import('@/components/pages/home/HomePagePreview'),
)

async function getDescription() {
  client
    .fetch(latestPostQuery)
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  return client.fetch(latestPostQuery)
}

async function IndexRoute() {
  const initial = await loadLandingPage()
  const { coverImage, overview } = await getDescription()

  const imageUrl =
    coverImage &&
    urlForImage(coverImage)?.height(250).width(250).fit('crop').url()

  if ((await draftMode()).isEnabled) {
    return <HomePagePreview initial={initial} />
  }

  return (
    <main className={styles.landing_container}>
      <div className={styles.top_section}>
        <h1 className={styles.top_text && styles.h1_text}>
          Welcome to The Pine Island Food Pantry
        </h1>
        <h2 className={styles.top_text && styles.h2_text}>
          Providing food assistance for those in need.
        </h2>
        <div className={styles.image_div}>
          <Image
            src={'/logo.svg'}
            alt="Pine Island Food Pantry Logo"
            fill={true}
            sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw"
          />
        </div>
        <a
          href="https://maps.app.goo.gl/DTgw8M5Lgby9eFvY6"
          className={styles.top_link}
        >
          12175 Stringfellow Road Bokeelia, FL 33922 USA
        </a>
      </div>
      <div className={styles.home_card}>
        <h3 className={styles.mission}>Our Mission</h3>
        <p className={styles.text}>
          Our pantry&apos;s mission is to ensure “No One Goes Hungry” on Greater
          Pine Island (Pine island and Matlacha). Our donations and volunteers
          provide a place for all families in our community who are “in need” to
          stop by and pick up food so they never have to worry about being
          hungry.{' '}
        </p>
        <Link href={'/about'} className={styles.btn_styles}>
          About Us
        </Link>
      </div>
      {/* end of first card */}
      <div className={styles.home_card}>
        <div className={styles.rounded_image}>
          <Image
            src={'/food_pantry_image.jpg'}
            alt="Inside of the pantry stocked with food."
            height={250}
            width={250}
          />
        </div>
        <h3 className={styles.volunteer}>Volunteer Opportunities</h3>
        <p className={styles.volunteer_text}>
          Local food pantries are always in need of volunteers to help with
          tasks such as sorting and packing food, assisting with deliveries, and
          organizing fundraising events. Volunteering at a food pantry not only
          provides essential support to your community, but it also offers a
          rewarding experience and the chance to develop new skills.
        </p>

        <Link href={'/contact'} className={styles.btn_styles}>
          Donate Time
        </Link>
      </div>
      {/* end of 2nd card */}
      {/* Ankor SVG background in div below */}
      <div className={styles.ankor_bg} />
      <div className={styles.home_card}>
        <div className={styles.rounded_image}>
          <Image
            src={imageUrl}
            alt="Image from latest post"
            height={200}
            width={200}
          />
        </div>
        <Link href="/posts" className={styles.latest}>
          View Our Latest Posts Here.
        </Link>
        <span className={styles.overview}>
          <CustomPortableText value={overview} />
        </span>
      </div>
      {/* About Us card */}
      <div className={styles.home_card}>
        <h3 className={styles.about_header}>About Us</h3>
        <p className={styles.about_text}>
          The Pine Island Food Pantry was founded in 1993 with the goal to
          ensure “No One Goes Hungry” on Greater Pine Island. The organization
          was incorporated under the laws of the State of Florida on January 2,
          2010 and is now a non-denominational, 501c3 non-profit organization -
          The Pine Island Food Pantry, Inc. We serve the residents of Pine
          Island and the greater Matlacha area and are open Mondays and
          Thursdays from 9am to 11am. Clients may pick up groceries twice per
          month. The pantry is housed in the Life Center of Our Lady of the
          Miraculous Medal Church at 12175 Stringfellow Rd, Bokeelia, FL 33922.
          <br></br>
          <br></br>
          New clients are welcome. An ID is required at each visit to verify
          residency in our service area. Food amounts are distributed by family
          size and ages. Groceries include milk, eggs, sliced cheese, baked
          goods, canned goods, pasta, meat, toilet paper and bar soap. Other
          personal care grooming and hygiene products, as well as pet food and
          baby products are also frequently available.
        </p>
        <Link href={'/about'} className={styles.btn_styles}>
          See Additional Resources
        </Link>
      </div>
      {/* Our Location Section */}
      <div className={styles.location}>
        <h3 className={styles.location_header}>Our Location</h3>
        <div className={styles.location_image}>
          <Image
            src={'/location-image.png'}
            alt="Map of Pine Island Food Pantry"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <ContactCard />
    </main>
  )
}

export default IndexRoute
