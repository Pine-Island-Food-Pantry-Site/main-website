'use client'
import useWeb3Forms from '@web3forms/react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import styles from '../../../styles/contact.module.css'

type Inputs = {
  name: string
  email: string
  phone: string
  message: string
  botcheck: string
}

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onTouched',
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')

  // Please update the Access Key in the .env
  const apiKey =
    process.env.NEXT_PUBLIC_FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE'

  const { submit: onSubmit } = useWeb3Forms({
    access_key: apiKey,
    settings: {
      from_name: 'Food Pantry Contact Form',
      subject: 'New Contact Message from your Website',
    },
    onSuccess: (msg, data) => {
      setIsSuccess(true)
      setMessage(msg)
      reset()
    },
    onError: (msg, data) => {
      setIsSuccess(false)
      setMessage(msg)
    },
  })

  return (
    <main className={styles.container}>
      <h1 className={styles.header_1}>The Pine Island Food Pantry</h1>
      <h2 className={styles.header_2}>
        Providing food assistance for those in need
      </h2>
      <div className={styles.image_div}>
        <Image
          src={'logo.svg'}
          alt="Pine Island Food Pantry Logo"
          fill={true}
          sizes="(max-width: 768px) 75vw, (max-width: 1200px) 50vw"
        />
      </div>
      <div className={styles.reach_out_card}>
        <div className={styles.reach_inner_card}>
          <h3 className={styles.header_3}>Reach Out</h3>
          <p>
            Email:{' '}
            <a
              className={styles.links}
              href="mailto:pineislandfoodpantry@gmail.com"
            >
              pineislandfoodpantry@gmail.com
            </a>
          </p>
          <p>
            Phone:{' '}
            <a className={styles.links} href="tel:1.760.529.7238">
              760-529-7238
            </a>
          </p>
        </div>
      </div>
      <div className={styles.outer_card}>
        <form className={styles.form_card} onSubmit={handleSubmit(onSubmit)}>
          <input
            type="checkbox"
            id=""
            className="hidden"
            style={{ display: 'none' }}
            {...register('botcheck')}
          ></input>

          <div className="mb-5">
            <label htmlFor="full_name" className="sr-only">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              placeholder="Full Name"
              autoComplete="false"
              className={`${styles.input}  ${
                errors.name
                  ? 'border-red-600 focus:border-red-600 ring-red-100 dark:ring-0'
                  : 'border-gray-300 focus:border-gray-600 ring-gray-100 dark:border-gray-600 dark:focus:border-white dark:ring-0'
              }`}
              {...register('name', {
                required: 'Full name is required',
                maxLength: 80,
              })}
            />
            {errors.name && (
              <div className="mt-1 text-red-600">
                <small>{errors.name?.message || 'Error'}</small>
              </div>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="email_address" className="sr-only">
              Email Address
            </label>
            <input
              id="email_address"
              type="email"
              placeholder="Email Address"
              className={`${styles.input}  ${
                errors.email
                  ? 'border-red-600 focus:border-red-600 ring-red-100 dark:ring-0'
                  : 'border-gray-300 focus:border-gray-600 ring-gray-100 dark:border-gray-600 dark:focus:border-white dark:ring-0'
              }`}
              {...register('email', {
                required: 'Enter your email',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email',
                },
              })}
            />
            {errors.email && (
              <div className="mt-1 text-red-600">
                <small>{errors.email.message || 'Error'}</small>
              </div>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="phone" className="sr-only">
              Email Address
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Phone Number"
              className={`${styles.input} ${
                errors.phone
                  ? 'border-red-600 focus:border-red-600 ring-red-100 dark:ring-0'
                  : 'border-gray-300 focus:border-gray-600 ring-gray-100 dark:border-gray-600 dark:focus:border-white dark:ring-0'
              }`}
              {...register('phone', {
                required: 'Enter your phone number',
                minLength: 6,
                maxLength: 12,
              })}
            />
            {errors.phone && (
              <div className="mt-1 text-red-600">
                <small>
                  {errors.phone?.message ||
                    'You must put in a valid phone number.'}
                </small>
              </div>
            )}
          </div>

          <div className="mb-5">
            <input
              placeholder="Your Message"
              className={`${styles.input} ${
                errors.message
                  ? 'border-red-600 focus:border-red-600 ring-red-100 dark:ring-0'
                  : 'border-gray-300 focus:border-gray-600 ring-gray-100 dark:border-gray-600 dark:focus:border-white dark:ring-0'
              }`}
              {...register('message', {
                required: 'Enter your Message',
              })}
            />
            {errors.message && (
              <div className="mt-1 text-red-600">
                {' '}
                <small>{errors.message.message || 'Error'}</small>
              </div>
            )}
          </div>

          <button type="submit" className={styles.submit_button}>
            {isSubmitting ? (
              <svg
                className="w-5 h-5 mx-auto text-white dark:text-black animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {isSubmitSuccessful && isSuccess && (
          <div className="mt-3 text-sm text-center text-green-500">
            {message || 'Success. Message sent successfully'}
          </div>
        )}
        {isSubmitSuccessful && !isSuccess && (
          <div className="mt-3 text-sm text-center text-red-500">
            {message || 'Something went wrong. Please try again later.'}
          </div>
        )}
      </div>
    </main>
  )
}
