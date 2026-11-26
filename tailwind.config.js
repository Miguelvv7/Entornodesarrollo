/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08090D',
        surface: '#11131B',
        raised: '#171A24',
        line: 'rgba(248,250,252,0.08)',
        line2: 'rgba(248,250,252,0.14)',
        violet: '#8B5CF6',
        lilac: '#A78BFA',
        sky: '#38BDF8',
        snow: '#F8FAFC',
        mute: '#94A3B8',
        // acentos de editor (tema oscuro de IntelliJ como referencia)
        kw: '#CF8E6D',
        str: '#6AAB73',
        num: '#2AACB8',
        fn: '#56A8F5',
        cmt: '#7A7E85',
        err: '#F75464',
        ok: '#5FB865',
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: { tightest: '-0.045em' },
    },
  },
  plugins: [],
};
