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
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
    '3xl': '1800px', // custom breakpoint
  },
    colors: {
      'blue': 'var(--blue)',
      'orange': 'var(--orange)',
      'dark-orange': 'var(--dark-orange)',
      'dark-blue': 'var(--dark-blue)',
      'light-blue': 'var(--light-blue)',
      'white': 'var(--white)',
      'black': 'var(--black)',
      'gray': 'var(--gray)',
      'filter-half-blue': 'var(--filter-half-blue)',
    },
    extend: {
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