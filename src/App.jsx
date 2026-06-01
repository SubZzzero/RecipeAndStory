import { useCallback, useRef, useState } from 'react'
import Header from './components/Header'
import ImageCard from './components/ImageCard'
import RandomButton from './components/RandomButton'
import Footer from './components/Footer'
import { fetchRandomFoodImage } from './services/pixabay'
import styles from './App.module.css'

const DEFAULT_IMAGE = '/img/default_2.png'
const MIN_TRANSITION_MS = 320

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })
}

function getStatusMessage(status) {
  if (status === 'loading') return 'Collecting a fresh meal shot...'
  if (status === 'error') return 'Something went wrong. Please try again.'
  if (status === 'empty') return 'No photos found right now. Try again.'
  return 'Tap the button to discover a random food image.'
}

export default function App() {
  const [status, setStatus] = useState('idle')
  const [image, setImage] = useState({
    imageUrl: DEFAULT_IMAGE,
    imageAlt: 'Default food placeholder',
    imageLink: '',
    author: 'Foodsum',
  })

  const requestControllerRef = useRef(null)

  const handleRandomPhoto = useCallback(async () => {
    if (requestControllerRef.current) {
      requestControllerRef.current.abort()
    }

    const controller = new AbortController()
    requestControllerRef.current = controller

    setStatus('loading')

    try {
      const [nextImage] = await Promise.all([
        fetchRandomFoodImage(controller.signal),
        new Promise((resolve) => setTimeout(resolve, MIN_TRANSITION_MS)),
      ])

      if (!nextImage) {
        setStatus('empty')
        return
      }

      await preloadImage(nextImage.imageUrl)
      setImage(nextImage)
      setStatus('success')
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
      setStatus('error')
    }
  }, [])

  const isLoading = status === 'loading'

  return (
    <div className={styles.appShell}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Daily visual inspiration</p>
          <h1 className={styles.title}>Find your next food mood</h1>
          <p className={styles.subtitle}>
            One tap, one random high-resolution food photo from Pixabay.
          </p>
        </div>

        <ImageCard
          imageUrl={image.imageUrl}
          imageAlt={image.imageAlt}
          imageLink={image.imageLink}
          status={status}
          message={getStatusMessage(status)}
          author={image.author}
        />

        <div className={styles.actions}>
          <RandomButton isLoading={isLoading} onClick={handleRandomPhoto} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
