// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@shadcn-ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(165, 70%, 40%)', // eco-friendly teal
        secondary: 'hsl(45, 85%, 55%)', // warm sunrise
        accent: 'hsl(280, 70%, 50%)', // subtle accent
      },
    },
  },
  plugins: [],
};
