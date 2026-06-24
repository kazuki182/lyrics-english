import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F7F4",
        ink: "#1F2933",
        muted: "#6B7280",
        accent: "#1F4E5F",
        verb: "#B91C1C"
      }
    }
  },
  plugins: []
};
export default config;
