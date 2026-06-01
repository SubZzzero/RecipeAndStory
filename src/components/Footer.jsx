import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Created by{' '}
        <a href="https://github.com/SubZzzero" target="_blank" rel="noreferrer">
          Denis Lukyanenko
        </a>
      </p>
      <p>
        Images from{' '}
        <a href="https://pixabay.com" target="_blank" rel="noreferrer">
          Pixabay
        </a>
      </p>
    </footer>
  )
}
