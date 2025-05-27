import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Принудительная прокрутка вверх при смене маршрута
    const scrollToTop = () => {
      // Несколько способов прокрутки для максимальной совместимости
      try {
        // Способ 1: scrollTo с поведением
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      } catch (error) {
        // Способ 2: обычный scrollTo
        window.scrollTo(0, 0)
      }
      
      // Способ 3: принудительная установка scrollTop для body и html
      if (document.body) {
        document.body.scrollTop = 0
      }
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
    }

    // Задержка для обеспечения корректной работы после рендера
    const timeoutId = setTimeout(scrollToTop, 10)
    
    // Дополнительная проверка через 100мс
    const fallbackTimeoutId = setTimeout(() => {
      if (window.scrollY > 0) {
        scrollToTop()
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(fallbackTimeoutId)
    }
  }, [pathname])

  // Дополнительный эффект для принудительной прокрутки после загрузки
  useEffect(() => {
    const handleLoad = () => {
      window.scrollTo(0, 0)
    }

    // Если страница уже загружена
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [pathname])
}

export default useScrollToTop