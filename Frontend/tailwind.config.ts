import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        oomni: {
          dark: '#0f172a',
          navy: '#1e293b',
          lightBg: '#f8fafc',
          border: '#e2e8f0',
          accent: '#6366f1',
          accentHover: '#4f46e5',
          critical: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          pending: '#ea580c',
          card: '#ffffff',
          textMain: '#1e293b',
          textMuted: '#64748b',
        },
      },
    },
  },
  plugins: [],
};

export default config;

