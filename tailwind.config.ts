import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal': {
          'green': '#00FF41',
          'green-dim': '#008F11',
          'amber': '#FFB000',
          'red': '#FF0040',
          'bg': '#0D0208',
          'bg-light': '#1A1A1A',
        }
      },
      fontFamily: {
        'terminal': ['VT323', 'monospace'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 65, 0.5)',
        'glow-amber': '0 0 20px rgba(255, 176, 0, 0.5)',
        'glow-red': '0 0 20px rgba(255, 0, 64, 0.5)',
      }
    }
  },
  plugins: [],
} satisfies Config
