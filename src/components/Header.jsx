import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.brand} aria-label="RecipeAndStory logo">
          R.
        </span>
        <a
          className={styles.github}
          href="https://github.com/SubZzzero"
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub profile"
        >
          <img src="/img/github.png" alt="GitHub" />
        </a>
      </div>
    </header>
  )
}
