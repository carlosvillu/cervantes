import form from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        prose: ['Tangerine', 'cursive'] // Asegúrate de incluir una fuente de respaldo
      }
    }
  },
  plugins: [form]
}
