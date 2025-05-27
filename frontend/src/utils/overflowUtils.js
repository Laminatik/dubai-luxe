// Утилиты для предотвращения overflow проблем в Dubai Luxe

/**
 * Управление скроллом body при модальных окнах
 */
export const bodyScrollManager = {
  // Сохраняем оригинальные стили
  originalStyles: {},
  
  disable() {
    const scrollY = window.scrollY
    this.originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      left: document.body.style.left,
      right: document.body.style.right
    }
    
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.left = '0'
    document.body.style.right = '0'
  },
  
  enable() {
    const scrollY = document.body.style.top
    
    // Восстанавливаем оригинальные стили
    Object.keys(this.originalStyles).forEach(key => {
      document.body.style[key] = this.originalStyles[key] || ''
    })
    
    // Восстанавливаем позицию скролла
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }
}

/**
 * Проверка и исправление overflow для элементов
 */
export const overflowChecker = {
  /**
   * Проверяет, выходит ли элемент за границы контейнера
   */
  isOverflowing(element, container = document.body) {
    const elementRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    
    return {
      horizontal: elementRect.right > containerRect.right || elementRect.left < containerRect.left,
      vertical: elementRect.bottom > containerRect.bottom || elementRect.top < containerRect.top,
      right: elementRect.right > containerRect.right,
      left: elementRect.left < containerRect.left,
      bottom: elementRect.bottom > containerRect.bottom,
      top: elementRect.top < containerRect.top
    }
  },
  
  /**
   * Исправляет горизонтальный overflow для dropdown элементов
   */
  fixDropdownPosition(dropdown, trigger) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    
    const triggerRect = trigger.getBoundingClientRect()
    const dropdownRect = dropdown.getBoundingClientRect()
    
    let left = triggerRect.left
    let top = triggerRect.bottom + 8
    
    // Проверяем горизонтальные границы
    if (left + dropdownRect.width > viewport.width - 16) {
      left = viewport.width - dropdownRect.width - 16
    }
    if (left < 16) {
      left = 16
    }
    
    // Проверяем вертикальные границы
    if (top + dropdownRect.height > viewport.height - 16) {
      top = triggerRect.top - dropdownRect.height - 8
    }
    
    return { left, top }
  }
}

/**
 * Утилиты для работы с текстом и его переполнением
 */
export const textOverflowUtils = {
  /**
   * Проверяет, переполняется ли текст в элементе
   */
  isTextOverflowing(element) {
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight
  },
  
  /**
   * Обрезает текст до указанной длины с добавлением троеточия
   */
  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  },
  
  /**
   * Создает анимированный скролл текста для длинного контента
   */
  createScrollingText(element) {
    if (!this.isTextOverflowing(element)) return
    
    const textContent = element.textContent
    element.innerHTML = `<span class="scrolling-text">${textContent}</span>`
    
    const span = element.querySelector('.scrolling-text')
    span.style.cssText = `
      display: inline-block;
      white-space: nowrap;
      animation: scroll-text 10s linear infinite;
      animation-play-state: paused;
    `
    
    element.addEventListener('mouseenter', () => {
      span.style.animationPlayState = 'running'
    })
    
    element.addEventListener('mouseleave', () => {
      span.style.animationPlayState = 'paused'
    })
  }
}

/**
 * Z-index управление для предотвращения конфликтов
 */
export const zIndexManager = {
  layers: {
    base: 1,
    sidebar: 30,
    navigation: 50,
    filters: 45,
    mobileButtons: 40,
    dropdown: 9999,
    modal: 10000,
    toast: 10001
  },
  
  /**
   * Получает правильный z-index для типа элемента
   */
  getZIndex(type) {
    return this.layers[type] || this.layers.base
  },
  
  /**
   * Применяет z-index к элементу
   */
  applyZIndex(element, type) {
    if (element) {
      element.style.zIndex = this.getZIndex(type)
    }
  }
}

/**
 * Responsive утилиты для адаптивности
 */
export const responsiveUtils = {
  /**
   * Проверяет текущий размер экрана
   */
  getScreenSize() {
    const width = window.innerWidth
    if (width < 640) return 'mobile'
    if (width < 768) return 'sm'
    if (width < 1024) return 'md'
    if (width < 1280) return 'lg'
    return 'xl'
  },
  
  /**
   * Проверяет, является ли устройство мобильным
   */
  isMobile() {
    return this.getScreenSize() === 'mobile'
  },
  
  /**
   * Проверяет, является ли устройство планшетом
   */
  isTablet() {
    const size = this.getScreenSize()
    return size === 'sm' || size === 'md'
  },
  
  /**
   * Адаптивные значения на основе размера экрана
   */
  getResponsiveValue(values) {
    const size = this.getScreenSize()
    return values[size] || values.default || values[Object.keys(values)[0]]
  }
}

/**
 * Утилиты для безопасного рендеринга контента
 */
export const safeRenderUtils = {
  /**
   * Создает безопасный контейнер с контролем overflow
   */
  createSafeContainer(className = '') {
    const container = document.createElement('div')
    container.className = `w-full max-w-full overflow-hidden box-border ${className}`
    return container
  },
  
  /**
   * Применяет безопасные стили к существующему элементу
   */
  makeSafe(element) {
    element.style.cssText += `
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      box-sizing: border-box;
      word-wrap: break-word;
      overflow-wrap: break-word;
    `
  },
  
  /**
   * Проверяет и исправляет элементы, выходящие за границы
   */
  fixOverflowingElements(container = document.body) {
    const elements = container.querySelectorAll('*')
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      
      if (rect.right > containerRect.right) {
        this.makeSafe(element)
      }
    })
  }
}

/**
 * Утилиты для dropdown компонентов
 */
export const dropdownUtils = {
  /**
   * Безопасное позиционирование dropdown
   */
  positionDropdown(dropdown, trigger, options = {}) {
    const {
      preferredPosition = 'bottom',
      offset = 8,
      boundary = document.body
    } = options
    
    const triggerRect = trigger.getBoundingClientRect()
    const dropdownRect = dropdown.getBoundingClientRect()
    const boundaryRect = boundary.getBoundingClientRect()
    
    let position = {
      left: triggerRect.left,
      top: triggerRect.bottom + offset,
      maxHeight: boundaryRect.bottom - triggerRect.bottom - offset - 16
    }
    
    // Проверяем горизонтальные границы
    if (position.left + dropdownRect.width > boundaryRect.right - 16) {
      position.left = boundaryRect.right - dropdownRect.width - 16
    }
    if (position.left < boundaryRect.left + 16) {
      position.left = boundaryRect.left + 16
    }
    
    // Проверяем вертикальные границы
    if (preferredPosition === 'top' || position.maxHeight < 120) {
      position.top = triggerRect.top - dropdownRect.height - offset
      position.maxHeight = triggerRect.top - boundaryRect.top - offset - 16
    }
    
    return position
  },
  
  /**
   * Добавляет обработчики для безопасного закрытия dropdown
   */
  addSafeCloseHandlers(dropdown, trigger, onClose) {
    const handleClickOutside = (event) => {
      if (!dropdown.contains(event.target) && !trigger.contains(event.target)) {
        onClose()
      }
    }
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    const handleScroll = (event) => {
      // Закрываем только при скролле вне dropdown
      if (!dropdown.contains(event.target)) {
        onClose()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('scroll', handleScroll, true)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }
}

/**
 * Главная функция для инициализации всех overflow защит
 */
export const initOverflowProtection = () => {
  // Добавляем глобальные стили для предотвращения overflow
  const style = document.createElement('style')
  style.textContent = `
    .overflow-safe {
      width: 100% !important;
      max-width: 100% !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
    }
    
    .max-w-7xl {
      max-width: min(80rem, calc(100vw - 2rem)) !important;
    }
    
    @keyframes scroll-text {
      0% { transform: translateX(0%); }
      25% { transform: translateX(0%); }
      75% { transform: translateX(calc(-100% + 200px)); }
      100% { transform: translateX(calc(-100% + 200px)); }
    }
  `
  document.head.appendChild(style)
  
  // Периодически проверяем overflow элементы
  const checkOverflow = () => {
    safeRenderUtils.fixOverflowingElements()
  }
  
  // Проверяем при загрузке и изменении размера
  window.addEventListener('load', checkOverflow)
  window.addEventListener('resize', checkOverflow)
  
  return () => {
    window.removeEventListener('load', checkOverflow)
    window.removeEventListener('resize', checkOverflow)
  }
}

// Экспортируем все утилиты
export default {
  bodyScrollManager,
  overflowChecker,
  textOverflowUtils,
  zIndexManager,
  responsiveUtils,
  safeRenderUtils,
  dropdownUtils,
  initOverflowProtection
}