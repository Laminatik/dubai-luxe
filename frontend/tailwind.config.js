/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dubai-black': '#000000',
        'dubai-white': '#FFFFFF',
        'dubai-gold': '#C9A351',
        'dubai-gold-light': '#E8C168',
        'dubai-gold-dark': '#a9862f',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gold': 'linear-gradient(135deg, #C9A351 0%, #E8C168 50%, #C9A351 100%)',
        'luxury-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'premium-hero': 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'luxury-pulse': 'luxuryPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'subtle-float': 'subtleFloat 20s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        luxuryPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(0,0,0,0.1), 0 4px 20px rgba(201,163,81,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
        'luxury-hover': '0 25px 60px rgba(0,0,0,0.15), 0 10px 30px rgba(201,163,81,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        '10xl': '10rem',
        '11xl': '12rem',
      },
      lineHeight: {
        'extra-loose': '2.5',
      },
      letterSpacing: {
        'ultra-wide': '0.3em',
      },
      // ИСПРАВЛЕНО: Единая система z-index без конфликтов
      zIndex: {
        // Базовые слои (оставляем старые для совместимости)
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        
        // НОВАЯ АРХИТЕКТУРА Dubai Luxe (используем названия для ясности)
        'base': '1',
        'elevated': '10',
        'sticky': '20',
        'sidebar': '30',
        'mobile-buttons': '40',
        'filters': '45',
        'navigation': '50',
        'overlay': '60',
        'modal-backdrop': '9998',
        'dropdown': '9999',
        'modal': '10000',
        'modal-content': '10001',
        'toast': '10002',
        'debug': '99999',
      },
      // НОВОЕ: Добавляем поддержку overflow-clip
      overflow: {
        'clip': 'clip',
      }
    },
  },
  plugins: [
    // НОВОЕ: Кастомный плагин для поддержки overflow-clip во всех браузерах
    function({ addUtilities }) {
      const newUtilities = {
        '.overflow-x-clip': {
          'overflow-x': 'clip',
          // Fallback для старых браузеров
          '@supports not (overflow-x: clip)': {
            'overflow-x': 'hidden',
          }
        },
        '.overflow-y-clip': {
          'overflow-y': 'clip',
          // Fallback для старых браузеров
          '@supports not (overflow-y: clip)': {
            'overflow-y': 'hidden',
          }
        },
        '.overflow-clip': {
          'overflow': 'clip',
          // Fallback для старых браузеров
          '@supports not (overflow: clip)': {
            'overflow': 'hidden',
          }
        },
        // Утилиты специально для работы со sticky
        '.sticky-safe': {
          'position': 'sticky',
          'position': '-webkit-sticky', // Safari префикс
        },
        '.overflow-sticky-safe': {
          // Безопасный overflow для sticky элементов
          'overflow-x': 'clip',
          '@supports not (overflow-x: clip)': {
            'overflow-x': 'visible',
          }
        }
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}