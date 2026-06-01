import styles from './ImageCard.module.css'

export default function ImageCard({ imageUrl, imageAlt, imageLink, status, message, author }) {
  const cardClass = `${styles.card} ${status === 'loading' ? styles.loading : ''}`

  return (
    <section className={cardClass} aria-live="polite">
      <a
        className={styles.imageLink}
        href={imageLink || '#'}
        target="_blank"
        rel="noreferrer"
        aria-disabled={!imageLink}
        onClick={(event) => {
          if (!imageLink) {
            event.preventDefault()
          }
        }}
      >
        {imageUrl ? (
          <img className={styles.image} src={imageUrl} alt={imageAlt} loading="eager" />
        ) : (
          <div className={styles.placeholder}>Loading first image...</div>
        )}
      </a>

      <div className={styles.meta}>
        <p className={styles.status}>{message}</p>
        <p className={styles.author}>Photo by {author}</p>
      </div>
    </section>
  )
}
