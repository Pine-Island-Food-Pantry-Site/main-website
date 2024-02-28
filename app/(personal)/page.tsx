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

export default async function IndexRoute() {
  const initial = await loadLandingPage()
  const { coverImage, overview } = await getDescription()

  const imageUrl =
    coverImage &&
    urlForImage(coverImage)?.height(250).width(250).fit('crop').url()

  if (draftMode().isEnabled) {
    return <HomePagePreview initial={initial} />
  }

  if (!initial.data) {
    return (
      <div className="text-center">
        You don&rsquo;t have a homepage yet,{' '}
        <Link href={`${studioUrl}/desk/home`} className="underline">
          create one now
        </Link>
        !
      </div>
    )
  }

  return (
    <main className={styles.landing_container}>
      <h1>Welcome to The Pine Island Food Pantry</h1>
      <h2>Providing food assistance for those in need.</h2>
      <Image
        src={'logo.svg'}
        alt="Pine Island Food Pantry Logo"
        width={200}
        height={200}
      />
      <a href="https://maps.app.goo.gl/DTgw8M5Lgby9eFvY6">
        12175 Stringfellow Road Bokeelia, FL 33922 USA
      </a>
      <div className={styles.home_card}>
        <h3>Our Mission</h3>
        <p>
          Our pantry&apos;s mission is to ensure “No One Goes Hungry” on Greater
          Pine Island (Pine island and Matlacha). Our donations and volunteers
          provide a place for all families in our community who are “in need” to
          stop by and pick up food so they never have to worry about being
          hungry.{' '}
        </p>
        <Link href={'/about'}>About Us</Link>
      </div>
      {/* end of first card */}
      <div className={styles.home_card}>
        <Image
          src={'/food_pantry_image.jpg'}
          alt="Inside of the pantry stocked with food."
          height={250}
          width={250}
        />
        <h3>Volunteer Opportunities</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          commodo, lorem id pharetra tristique, mauris odio condimentum sem, at
          lobortis quam nibh ac ante. Nulla facilisi. Donec condimentum
          vulputate eros tempus pulvinar. Nulla facilisi. Aliquam volutpat ipsum
          purus, vel tincidunt erat congue eu. Vestibulum et blandit ante.
        </p>

        <Link href={'/about'}>Donate Time</Link>
      </div>
      {/* end of 2nd card */}
      {/* Ankor SVG background in div below */}
      <div className={styles.ankor_bg} />
      <div className={styles.home_card}>
        <Image
          src={imageUrl}
          alt="Image from latest post"
          height={200}
          width={200}
        />
        <Link href="/post">View Our Latest Posts Here.</Link>
        <CustomPortableText value={overview} />
      </div>
      {/* About Us card */}
      <div className={styles.home_card}>
        <h3>About Us</h3>
        <p>
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
        <Link href={'/about'}>See Additional Resources</Link>
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
