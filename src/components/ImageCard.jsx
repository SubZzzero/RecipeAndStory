import styles from './ImageCard.module.css'
import RandomButton from './RandomButton'

export default function ImageCard({
  imageUrl,
  imageAlt,
  imageLink,
  status,
  message,
  author,
  tags = [],
  topicLabel = 'Food',
  isLoading,
  onRandomPhoto,
}) {
  const cardClass = `${styles.card} ${status === 'loading' ? styles.loading : ''}`
  const visibleTags = tags.slice(0, 4)

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
        <div className={styles.infoPanel}>
          <div>
            <span className={styles.infoLabel}>Current topic</span>
            <strong>{topicLabel}</strong>
          </div>

          <div>
            <span className={styles.infoLabel}>Image tags</span>
            <div className={styles.tags} aria-label="Image tags">
              {visibleTags.length > 0 ? (
                visibleTags.map((tag) => <span key={tag}>{tag}</span>)
              ) : (
                <span>food</span>
              )}
            </div>
          </div>

          <div>
            <span className={styles.infoLabel}>Source</span>
            <strong>Pixabay</strong>
          </div>
        </div>
        <p className={styles.author}>Photo by {author}</p>
      </div>

      <div className={styles.actions}>
        <RandomButton isLoading={isLoading} onClick={onRandomPhoto} />
      </div>
    </section>
  )
}
