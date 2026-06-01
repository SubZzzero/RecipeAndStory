import styles from './RandomButton.module.css'

export default function RandomButton({ isLoading, onClick }) {
  return (
    <button className={styles.button} type="button" onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Loading photo...' : 'Random photo'}
    </button>
  )
}
