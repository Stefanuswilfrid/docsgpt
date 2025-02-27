import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
		  },
  		colors: {
			colors: {
				black: "rgb(var(--black) / <alpha-value>)",
				white: "rgb(var(--white) / <alpha-value>)",
				secondary: 'rgba(0, 0, 0, 0.2)',
								smoke: "rgb(var(--smoke) / <alpha-value>)",
				hovered: "rgb(var(--hovered) / <alpha-value>)",
				subtle: "rgb(var(--subtle) / <alpha-value>)",
		
				softblack: "rgb(var(--softblack) / <alpha-value>)",
				zinc: "rgb(var(--zinc) / <alpha-value>)",
				softzinc: "rgb(var(--softzinc) / <alpha-value>)",
				wheat: "rgb(var(--wheat) / <alpha-value>)",
				mossgreen: "rgb(var(--mossgreen) / <alpha-value>)",
				empty: "rgb(var(--empty) / <alpha-value>)",
				border: "rgb(var(--border) / <alpha-value>)",
				smokewhite: "rgb(var(--smokewhite) / <alpha-value>)",
				"light-smokewhite": "rgb(var(--light-smokewhite) / <alpha-value>)",
				lightgray: "rgb(var(--lightgray) / <alpha-value>)",
			  },
  		},
  		
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
