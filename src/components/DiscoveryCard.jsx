import styles from './DiscoveryCard.module.css'

export default function DiscoveryCard({
  eyebrow,
  title,
  text,
  imageUrl,
  imageAlt,
  meta,
  buttonLabel,
  disabled = false,
  isLoading,
  onOpen,
}) {
  const isButtonDisabled = isLoading || disabled

  return (
    <article className={`${styles.card} ${isLoading ? styles.loading : ''}`}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
        {meta ? <p className={styles.meta}>{meta}</p> : null}
        <p className={styles.text}>{text}</p>
      </div>

      {imageUrl ? (
        <img className={styles.image} src={imageUrl} alt={imageAlt} loading="lazy" />
      ) : null}

      <button className={styles.button} type="button" disabled={isButtonDisabled} onClick={onOpen}>
        {buttonLabel}
      </button>
    </article>
  )
}
