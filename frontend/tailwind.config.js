/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amazon: {
          nav: '#131921',
          secondary: '#232F3E',
          orange: '#FF9900',
          'orange-hover': '#FEBD69',
          teal: '#007185',
          page: '#F0F2F2',
          error: '#CC0C39',
          'grade-new': '#007600',
          muted: '#565959',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'amazon-btn': '0 2px 5px rgba(213,217,217,.5)',
        'amazon-card': '0 2px 5px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
