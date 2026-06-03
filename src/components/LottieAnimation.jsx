import { useEffect, useRef } from 'react'

export default function LottieAnimation({ className, path, label }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let isActive = true
    let animation = null

    import('lottie-web/build/player/lottie_light').then((module) => {
      if (!isActive || !containerRef.current) return

      animation = module.default.loadAnimation({
        container: containerRef.current,
        path,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
        },
      })
    })

    return () => {
      isActive = false
      if (animation) animation.destroy()
    }
  }, [path])

  return <div ref={containerRef} className={className} role="img" aria-label={label} />
}
