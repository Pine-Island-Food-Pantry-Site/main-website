/* eslint-disable jsx-a11y/alt-text */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useEffect, useState } from 'react'

import { studioUrl } from '@/sanity/lib/api'

import cover from './cover.png'

export default memo(function IntroTemplate() {
  const [studioURL, setStudioURL] = useState<string | null>(null)
  const [isLocalHost, setIsLocalhost] = useState(false)
  const pathname = usePathname()

  const hasEnvFile = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const hasRepoEnvVars =
    process.env.NEXT_PUBLIC_VERCEL_GIT_PROVIDER &&
    process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER &&
    process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG
  const repoURL = `https://${process.env.NEXT_PUBLIC_VERCEL_GIT_PROVIDER}.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}`
  const removeBlockURL = hasRepoEnvVars
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_GIT_PROVIDER}.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/blob/main/README.md#how-can-i-remove-the-next-steps-block-from-my-app`
    : `https://github.com/sanity-io/template-nextjs-clean#how-can-i-remove-the-next-steps-block-from-my-app`

  const [hasUTMtags, setHasUTMtags] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStudioURL(`${window.location.origin}${studioUrl}`)
      setIsLocalhost(window.location.hostname === 'localhost')
      setHasUTMtags(window.location.search.includes('utm'))
    }
  }, [])

  // Only display this on the home page
  if (pathname !== '/') {
    return null
  }

  if (hasUTMtags || !studioURL) {
    return null
  }

  return (
    <div className="flex flex-col bg-gradient">
      <div className="flex gap-5 justify-between items-end px-11 py-2.5 w-full text-2xl text-center text-black bg-white max-md:flex-wrap max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between self-stretch max-md:flex-wrap max-md:max-w-full">
          <Image
            src="/logo.svg"
            alt="food pantry logo"
            width={100}
            height={100}
          />
          <div className="flex-auto self-end mt-7">Pine Island Food Pantry</div>
        </div>
        <div className="mt-7 underline">Donate</div>
        <div className="mt-7 underline">About Us</div>
        <div className="flex-auto mt-7 underline">Contact</div>
      </div>
      <div className="flex flex-col items-center py-12 pl-3.5 w-full max-md:max-w-full">
        <div className="mt-16 text-4xl text-blue-950 max-md:mt-10 max-md:max-w-full">
          Welcome to Pine Island Food Pantry
        </div>
        <div className="mt-6 text-2xl text-center text-blue-950 max-md:max-w-full">
          Providing food assistance for those in need
        </div>
        <div className="flex gap-5 justify-between mt-16 max-w-full text-3xl text-center text-black whitespace-nowrap w-[495px] max-md:flex-wrap max-md:mt-10">
          <div className="w-[207px] h-[68px] pt-3 bg-gradient-to-r from-green-500 to-cyan-400 rounded-[46px] shadow border border-black">
            Get Help
          </div>
          <div className="w-[207px] h-[68px] pt-3 bg-gradient-to-r from-green-500 to-cyan-400 rounded-[46px] shadow border border-black">
            Give Help
          </div>
        </div>
        <div className="mt-20 text-2xl text-center underline text-blue-950 max-md:mt-10 max-md:max-w-full">
          12175 Stringfellow Road
          <br />
          Bokeelia, FL 33922
          <br />
          USA
        </div>
        <div className="px-16 py-12 mt-14 max-w-full bg-white rounded-[10px] w-[1000px] max-md:px-5 max-md:mt-10">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
            <div className="flex flex-col w-[36%] max-md:ml-0 max-md:w-full">
              <Image
                src="/logo.svg"
                alt="food pantry logo"
                layout="fixed"
                objectFit="contain"
                width={250}
                height={250}
              />
            </div>
            <div className="flex flex-col ml-5 w-[64%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow mt-2.5 text-3xl text-blue-950 max-md:mt-10 max-md:max-w-full">
                <div className="max-md:max-w-full">Our Mission</div>
                <div className="mt-4 text-2xl max-md:max-w-full">
                  Our pantry’s mission is to ensure “No One Goes Hungry” on
                  Greater Pine Island (Pine island and Matlacha).
                  <br></br>
                  Our donations and volunteers provide a place for all families
                  in our community who are “in need” to stop by and pick up food
                  so they never have to worry about being hungry.
                </div>
                <div className="w-[207px] h-[68px] mt-6 bg-gradient-to-r from-green-500 to-cyan-400 rounded-[46px] shadow border border-black">
                  <div className="w-[207px] pt-3 text-center text-black text-[28px] font-normal">
                    About Us
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-11 py-12 mt-10 max-w-full bg-white rounded-[10px] w-[1000px] max-md:px-5 max-md:mt-10">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
            <div className="flex flex-col w-[59%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-3xl text-neutral-700 max-md:mt-10 max-md:max-w-full">
                <div className="max-md:max-w-full">Volunteer Opportunities</div>
                <div className="mt-8 text-xl max-md:max-w-full">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  commodo, lorem id pharetra tristique, mauris odio condimentum
                  sem, at lobortis quam nibh ac ante. Nulla facilisi. Donec
                  condimentum vulputate eros tempus pulvinar. Nulla facilisi.
                  Aliquam volutpat ipsum purus, vel tincidunt erat congue eu.
                  Vestibulum et blandit ante.
                </div>
                <div className="w-[207px] h-[74px] mt-6 bg-gradient-to-r from-green-500 to-cyan-400 rounded-[46px] shadow border border-black">
                  <div className="w-[207px] h-[34px] pt-3 text-center text-black text-[28px] font-normal">
                    Donate Time
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[41%] max-md:ml-0 max-md:w-full">
              <div className="justify-center pt-24 pr-8 pb-12 pl-16 mt-2 w-full text-3xl text-center text-black rounded-3xl bg-black bg-opacity-30 max-md:pt-10 max-md:pr-5 max-md:pl-7 max-md:mt-10">
                Image of Food Pantry
              </div>
            </div>
          </div>
        </div>
        <div className="ankor-bg-div w-full min-h-[200px] mt-6"></div>
        <div className="px-16 py-12 mt-20 max-w-full bg-white rounded-xl w-[989px] max-md:px-5 max-md:mt-10">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="justify-center self-stretch px-11 pt-14 pb-12 my-auto w-full text-5xl text-white rounded-3xl bg-black bg-opacity-70 max-md:px-5 max-md:mt-10">
                Image from post or logo
              </div>
            </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="mt-6 text-3xl text-black whitespace-nowrap max-md:mt-10">
                View Our Lasted Posts Here:
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-14 py-12 mt-16 max-w-full text-xl bg-white rounded-[10px] text-neutral-700 w-[989px] max-md:px-5 max-md:mt-10">
          <div className="text-3xl max-md:max-w-full mb-5">About Us</div>
          <div className="tracking-wide max-md:max-w-full">
            The Pine Island Food Pantry is a non-denominational, 501c3
            non-profit organization serving the residents of Pine Island and the
            greater Matlacha area and is open Mondays and Thursdays from 9am to
            11am. Clients may pick up groceries twice per month. The pantry is
            housed in the Life Center of Our Lady of the Miraculous Medal Church
            at 12175 Stringfellow Rd, Bokeelia, FL 33922.
            <br />
            <br />
            New clients are welcome. An ID is required at each visit to verify
            residency in our service area. Food amounts are distributed by
            family size and ages. Groceries include milk, eggs, sliced cheese,
            baked goods, canned goods, pasta, meat, toilet paper and bar soap.
            Other personal care grooming and hygiene products, as well as pet
            food and baby products are also frequently available.
          </div>
          <div className="w-[207px] h-[74px] mt-6 bg-gradient-to-r from-green-500 to-cyan-400 rounded-[46px] shadow border border-black">
            <div className="w-[207px] h-[74px] pt-2 text-center text-black text-xl font-normal font-['Arial']">
              See Additional Resources
            </div>
          </div>
        </div>
        <div className="mt-40 text-4xl text-center text-black max-md:mt-10 max-md:max-w-full">
          Our Location
        </div>
        <img
          alt="stuff"
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/c71baaa711dbccde10dff872090b1ffda6c29032bea05d909321186d10877bad?apiKey=52b45eda92454e888b0e2206ab05c02c&"
          className="max-w-full aspect-[1.61] w-[989px]"
        />
        <div className="flex relative flex-col px-12 py-12 mt-8 max-w-full min-h-[600px] w-[990px] max-md:px-5 rounded-[10px] ankor-bg">
          <div className="relative max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex relative flex-col grow pt-7 pr-4 pb-12 pl-12 mt-1.5 w-full text-black bg-white rounded-3xl border-2 border-red-500 border-solid shadow-sm max-md:pl-5 max-md:mt-10 rounded-[10px]">
                  <div className="self-start ml-3 text-4xl text-center max-md:ml-2.5">
                    Address
                  </div>
                  <div className="mt-7 text-3xl underline">
                    12175 Stringfellow Road
                    <br />
                    Bokeelia, FL 33922
                    <br />
                    USA
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="relative grow px-8 pt-20 pb-0.5 w-full text-2xl text-black bg-white rounded-3xl border-2 border-red-500 border-solid shadow-sm max-md:pl-5 max-md:mt-10 rounded-[10px]">
                  Mon: 9:00-11:00 AM
                  <br />
                  Tue: Closed
                  <br />
                  Wed: Closed
                  <br />
                  Thur: 9:00-11:00 AM
                  <br />
                  Fri: Closed
                  <br />
                  Sat: Closed
                  <br />
                  Sun: Closed
                </div>
              </div>
            </div>
          </div>
          <div className="w-[207px] mt-10 bg-gradient-to-r from-green-500 to-cyan-400 rounded-[46px] shadow border border-black">
            <div className="w-[207px] text-center text-black text-[28px] font-normal">
              Contact Us
            </div>
          </div>
        </div>
        <div className="mt-20 mb-24 text-2xl text-blue-950 max-md:my-10 max-md:max-w-full">
          © 2024 Pine Island Food Pantry. All rights reserved.
        </div>
      </div>
    </div>
  )
})
