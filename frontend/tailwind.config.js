/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f172a',
          blue: '#1e3a8a',
          lightNavy: '#1e293b',
          card: '#ffffff',
          border: '#e2e8f0',
          gold: '#d97706',
          saffron: '#ea580c',
          accent: '#2563eb',
          muted: '#64748b',
          canvas: '#f8fafc'
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
