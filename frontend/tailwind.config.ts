import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    fontSize: {
      title1: ["24px", { lineHeight: "150%", letterSpacing: "-0.025em" }],
      title2: ["18px", { lineHeight: "150%", letterSpacing: "-0.015em" }],
      body1: ["16px", { lineHeight: "150%", letterSpacing: "0" }],
      body2: ["14px", { lineHeight: "150%", letterSpacing: "0" }],
      body3: ["12px", { lineHeight: "150%", letterSpacing: "0" }]
    },
    extend: {
      screens: {
        tb: { max: "768px" }, // 일반 타블렛 크기
        mb: { max: "480px" }, // 가장 큰 폰 크기
      }
    }
  },
  plugins: []
};
export default config;
