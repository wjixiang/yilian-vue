/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#42a5f5', // 深蓝色  
        secondary: '#006699', // 中蓝色  
        accent: '#66B2FF', // 浅蓝色  
        background: '#E6F2FF', // 淡蓝色  
        text: '#333333', // 深灰色
      }
    },
  },
  plugins: [],
}
