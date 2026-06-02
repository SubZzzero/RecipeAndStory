import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Images from{' '}
        <a href="https://pixabay.com" target="_blank" rel="noreferrer">
          Pixabay
        </a>
      </p>
      <p>
        Recipes from{' '}
        <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">
          TheMealDB
        </a>
        {' · '}Stories from curated notes and{' '}
        <a href="https://www.wikipedia.org" target="_blank" rel="noreferrer">
          Wikipedia
        </a>
      </p>
    </footer>
  )
}
