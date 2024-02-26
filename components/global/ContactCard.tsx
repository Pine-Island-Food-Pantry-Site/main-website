import Link from 'next/link'

import styles from '../../styles/contact_card.module.css'

const ContactCard: React.FC = () => {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h4 className={styles.header_4}>Address</h4>
        <p>12175 Stringfellow Road Bokeelia, FL 33922 USA</p>
      </div>
      <div className={styles.card}>
        <h4>Business Hours</h4>
        <dl className={styles.hours_list}>
          <dt>Monday</dt>
          <dd>9:00 AM - 11:00 AM</dd>
          <dt>Tuesday</dt>
          <dd>Closed</dd>
          <dt>Wednesday</dt>
          <dd>Closed</dd>
          <dt>Thursday</dt>
          <dd>9:00 AM - 11:00 AM</dd>
          <dt>Friday</dt>
          <dd>Closed</dd>
          <dt>Saturday</dt>
          <dd>Closed</dd>
          <dt>Sunday</dt>
          <dd>Closed</dd>
        </dl>
        <h4>Closed On All Federal Holidays</h4>
      </div>
      <button className={styles.contact_button}>
        <Link href={'home'}>Contact Us</Link>
      </button>
    </div>
  )
}

export default ContactCard
