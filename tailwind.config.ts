import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{ts,tsx,js,jsx,md,mdx}", "./mdx/**/*.{md,mdx}"],
  plugins: [typography],
} satisfies Config;
