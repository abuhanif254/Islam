import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        editorial: ['var(--font-noto-serif-bengali)', 'var(--font-hind-siliguri)', 'Georgia', 'serif'],
        sans: ['var(--font-hind-siliguri)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        arabic: ['var(--font-amiri)', 'Traditional Arabic', 'serif'],
      },
      colors: {
        islamic: {
          emerald: '#0B4F3B',
          'emerald-dark': '#083B2C',
          'emerald-light': '#146B50',
          ochre: '#B85D19',
          'ochre-light': '#E8A86B',
          paper: '#FAF8F5',
          dark: '#141615',
        },
      },
    },
  },
  plugins: [],
};

export default config;
