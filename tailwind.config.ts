/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss'

export default {
  content: [
    // ...
  ],
  theme: {
    // ...
  },
  plugins: [require('@tailwindcss/typography')] // 追記
} satisfies Config
