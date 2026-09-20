import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,js,jsx}", "./content/blog/**/*.md"],
  plugins: [typography],
} satisfies Config;
