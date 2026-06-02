import { useEffect } from 'react'
import styles from './DetailModal.module.css'

export default function DetailModal({ title, subtitle, imageUrl, imageAlt, children, sourceUrl, onClose }) {
  const modalClassName = imageUrl ? styles.modal : `${styles.modal} ${styles.textOnlyModal}`

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby="foodsum-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={styles.close} type="button" aria-label="Close detail panel" onClick={onClose}>
          ×
        </button>

        {imageUrl ? <img className={styles.image} src={imageUrl} alt={imageAlt} /> : null}

        <div className={styles.body}>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          <h2 id="foodsum-modal-title">{title}</h2>
          <div className={styles.content}>{children}</div>
          {sourceUrl ? (
            <a className={styles.source} href={sourceUrl} target="_blank" rel="noreferrer">
              Open source
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </section>
    </div>
  )
}
