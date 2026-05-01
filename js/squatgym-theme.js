(() => {
  const THEME_KEY = 'squatgym-theme';

  const colors = {
    'surface-bright': '#fcf9f8',
    'on-error-container': '#93000a',
    'surface-container-low': '#f6f3f2',
    'on-surface-variant': '#3d4a3e',
    tertiary: '#5d5f5f',
    'on-primary-fixed-variant': '#005228',
    'surface-container-highest': '#e5e2e1',
    'on-surface': '#1c1b1b',
    'secondary-fixed': '#e5e2e1',
    'outline-variant': '#bbcbbb',
    'error-container': '#ffdad6',
    primary: '#006d37',
    background: '#fcf9f8',
    'on-primary': '#ffffff',
    'primary-fixed': '#6bfe9c',
    'surface-container-high': '#eae7e7',
    'surface-container': '#f0eded',
    'on-tertiary-container': '#434546',
    outline: '#6c7b6d',
    'on-secondary-fixed': '#1c1b1b',
    error: '#ba1a1a',
    'surface-variant': '#e5e2e1',
    'on-background': '#1c1b1b',
    'primary-container': '#2ecc71',
    'on-secondary-container': '#636262',
    'secondary-container': '#e2dfde',
    'surface-dim': '#dcd9d9',
    'primary-fixed-dim': '#4ae183',
    'on-tertiary': '#ffffff',
    'surface-tint': '#006d37',
    'inverse-surface': '#313030',
    'on-tertiary-fixed': '#1a1c1c',
    'surface-container-lowest': '#ffffff',
    'on-secondary': '#ffffff',
    'on-secondary-fixed-variant': '#474746',
    'on-primary-fixed': '#00210c',
    'on-error': '#ffffff',
    'inverse-on-surface': '#f3f0ef',
    'secondary-fixed-dim': '#c8c6c5',
    surface: '#fcf9f8',
    'tertiary-fixed-dim': '#c6c6c7',
    'on-tertiary-fixed-variant': '#454747',
    secondary: '#5f5e5e',
    'tertiary-container': '#b2b3b3',
    'inverse-primary': '#4ae183',
    'on-primary-container': '#005027',
    'tertiary-fixed': '#e2e2e2'
  };

  const themeConfig = {
    darkMode: 'class',
    theme: {
      extend: {
        colors,
        borderRadius: {
          DEFAULT: '0.125rem',
          lg: '0.25rem',
          xl: '0.5rem',
          full: '0.75rem'
        },
        fontFamily: {
          headline: ['Manrope', 'sans-serif'],
          display: ['Manrope', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
          label: ['Inter', 'sans-serif']
        }
      }
    }
  };

  function readInitialTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch (error) {
      return 'light';
    }
  }

  function applyInitialTheme() {
    const selectedTheme = readInitialTheme() === 'dark' ? 'dark' : 'light';
    const html = document.documentElement;

    html.classList.remove('light', 'dark');
    html.classList.add(selectedTheme);
  }

  window.SquatGymTheme = {
    colors,
    config: themeConfig
  };

  window.tailwind = window.tailwind || {};
  window.tailwind.config = themeConfig;
  applyInitialTheme();
})();
