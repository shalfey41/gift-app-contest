import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector',
  theme: {
    fontSize: {
      xxs: ['12px', '18px'],
      xs: ['13px', '18px'],
      s: ['14px', '18px'],
      m: ['17px', '22px'],
      lg: ['24px', '32px'],
      xl: ['32px', '48px'],
    },
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'var(--foreground)',

        primary: 'rgb(var(--color-primary))',
        'accent-cyan': 'rgb(var(--color-accent-cyan))',
        'accent-gold': 'rgb(var(--color-accent-gold))',
        'accent-purple': 'rgb(var(--color-accent-purple))',
        'accent-green': 'rgb(var(--color-accent-green))',
        icons: 'rgb(var(--color-icons))',
        'label-secondary': 'rgb(var(--color-label-secondary))',
        'label-date': 'rgb(var(--color-label-date))',
        secondary: 'rgb(var(--color-bg-secondary))',
        'label-tab-bar': 'rgb(var(--color-label-tab-bar))',
        separator: 'rgb(var(--color-separator))',
        notification: 'rgb(var(--color-bg-notification))',

        'accent-blue': 'var(--color-accent-blue)',
        'tab-bar': 'var(--color-bg-tab-bar)',
      },
    },
  },
  plugins: [],
};
export default config;
