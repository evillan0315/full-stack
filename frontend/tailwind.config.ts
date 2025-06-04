extend: {
  animation: {
    'loading-bar': 'loadingBar 1.5s infinite linear',
  },
  keyframes: {
    loadingBar: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  },
}

