module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
    'xxs': '375px',
    'xs': {'max': '480px'},
    'sm': {'max':'640px'},
    'md': {'max': '768px'},
    'mb': {'max': '960px'}, // mobile breakpoint
    'tbx': {'max': '1115px'}, // tablet breakpoint
    'tb': {'min': '1115px'}, // tablet breakpoint
    'dt': {'min': '960px'}, // desktop breakpoint
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
    '3xl': '1800px', // custom breakpoint
  },
  colors: {
    'blue': 'var(--blue)',
    'blue-dark-blue-gradient': 'var(--blue-dark-blue-gradient)',
    'orange': 'var(--orange)',
    'dark-orange': 'var(--dark-orange)',
    'dark-blue': 'var(--dark-blue)',
    'light-blue': 'var(--light-blue)',
    'cold-white': 'var(--cold-white)',
    'off-white': 'var(--off-white)',
    'white': 'var(--white)',
    'black': 'var(--black)',
    'gray': 'var(--gray)',
    'filter-blue': 'var(--filter-blue)',
    'filter-dark-blue': 'var(--filter-dark-blue)',
    'filter-white': 'var(--filter-white)',
    'filter-black': 'var(--filter-black)',
  },
    extend: {
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(100px, 1fr))',
      },
      borderWidth: {
        '5': '5px',
      },
      fontFamily: {
        'k2d': ['K2D', 'sans-serif'],
      },
      minWidth: {
        'custom-min': '300px',  // Custom min-width
        '90vw': '90vw', // Adds a min-width utility for 90% of the viewport width
      },
      spacing: {
        'base': 'var(--base-margin)',
      },
      fontSize: {
        // Base sizes
        'body': 'clamp(0.875rem, 1vw + 0.5rem, 1.125rem)', // Responsive body text
        'caption': 'clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem)', // Smaller text like captions
        'headline': 'clamp(1.5rem, 2.5vw + 1rem, 3rem)', // Large headlines
        'subheadline': 'clamp(1.25rem, 2vw + 1rem, 2.5rem)', // Subheadings
        'title': 'clamp(2rem, 3vw + 1rem, 4rem)', // Titles for major sections
  
        // Preset sizes
        '2-xl': '1.875rem',
        '3-xl': '3.375rem',
        '4-xl': '4rem',
        '5-xl': '5.25rem',
        '6-xl': '6.25rem',
      },
      lineHeight: {
        'v-relaxed': '1.675',
    },
    filter: {
      'blue': 'invert(33%) sepia(30%) saturate(4643%) hue-rotate(190deg) brightness(93%) contrast(88%)',
      'cold-white': 'invert(96%) sepia(40%) saturate(5958%) hue-rotate(177deg) brightness(103%) contrast(106%)',
      'light-blue': 'invert(55%) sepia(77%) saturate(295%) hue-rotate(165deg) brightness(99%) contrast(91%)',
      'orange': 'invert(57%) sepia(31%) saturate(4465%) hue-rotate(360deg) brightness(102%) contrast(105%)',
      'dark-blue': 'invert(15%) sepia(26%) saturate(5464%) hue-rotate(190deg) brightness(92%) contrast(94%)',
      'white': 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
      'black': 'saturate(100%) brightness(0%)',
      'gray': 'invert(51%) sepia(15%) saturate(0%) hue-rotate(187deg) brightness(94%) contrast(85%)',
    },
    },
  },
  variants: {
    extend: {
      placeholderColor: ['responsive', 'dark', 'focus', 'hover', 'active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};