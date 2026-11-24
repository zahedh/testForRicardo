/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../libs/**/*.{js,jsx,ts,tsx}'],
  presets: [
    require('nativewind/preset'),
    // eslint-disable-next-line @nx/enforce-module-boundaries
    require('../../libs/design-tokens/src/tokens/tailwind.config.ts').default,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
