import Link from 'next/link'

import styles from '../../styles/contact_card.module.css'

const ContactCard: React.FC = () => {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h4 className={styles.header_4}>Address</h4>
        <p className={styles.p_text}>
          12175 Stringfellow Road Bokeelia, FL 33922 USA
        </p>
      </div>
      <div className={styles.card}>
        <h4 className={styles.header_4}>Business Hours</h4>
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
        <h4 className={styles.header_4}>Closed On All Federal Holidays</h4>
      </div>
      <div className={styles.contact_button}>
        <Link href={'/contact'}>Contact Us</Link>
      </div>
    </div>
  )
}

export default ContactCard
