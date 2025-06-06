/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'circular-web': ['circular-web', 'sans-serif'],
        'general': ['general', 'sans-serif'],
        'robert-medium': ['robert-medium', 'sans-serif'],
        'robert-regular': ['robert-regular', 'sans-serif'],
        'zentry': ['zentry', 'sans-serif'],
        
        // Display fonts - for headlines and hero text
        display: ["Poppins", "sans-serif"],
        heading: ["Montserrat", "Arial", "sans-serif"],
        
        // Body fonts - for readability
        body: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        
        // Creative/Brand fonts
        brand: ["Poppins", "Arial", "sans-serif"],
        creative: ["Abril Fatface", "cursive"],
        
        // Monospace for code/technical content
        mono: ["JetBrains Mono", "Consolas", "monospace"],
        
        // Alternative modern options
        modern: ["Space Grotesk", "Arial", "sans-serif"],
        elegant: ["Crimson Text", "Georgia", "serif"],
      },
     animation: {
     'ping-large': "ping-large 1.5s ease-in-out infinite",
     'move-left': "move-left 1s linear infinite", 
     'move-right': "move-right 1s linear infinite",
      },
        "move-left": {
          "0%": {
            transform: "translateX(0%)",
          },
          "100%": {
            transform: "translateX(-50%)", 
          },
      },
      colors: {
        blue: {
          50: "#DFDFF0",
          75: "#dfdff2",
          100: "#F0F2FA",
          200: "#010101",
          300: "#4FB7DD",
        },
        violet: {
          300: "#5724ff",
        },
        yellow: {
          100: "#8e983f",
          300: "#edff66",
        },
      },
    },
  },
  plugins: [],
};