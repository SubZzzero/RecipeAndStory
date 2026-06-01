import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="/" aria-label="Foodsum home">
          F.
        </a>
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
