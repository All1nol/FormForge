module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0D0D0F',
        'cyber-pink': '#FF2E63',
        'cyber-purple': '#8A2BE2',
        'cyber-blue': '#252A34',
        'cyber-gray': '#1A1B1F',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.cyber-pink), 0 0 20px theme(colors.cyber-purple)',
        'neon-hover': '0 0 10px theme(colors.cyber-pink), 0 0 30px theme(colors.cyber-purple)',
      }
    },
  },
  plugins: [],
} 