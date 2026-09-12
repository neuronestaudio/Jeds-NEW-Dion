import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque Variable", "Figtree Variable", "system-ui", "sans-serif"],
        sans: ["Figtree Variable", "system-ui", "sans-serif"],
        // Hero title only — the condensed caps face from Next Lvl Protection.
        condensed: ["Bebas Neue", "Bricolage Grotesque Variable", "system-ui", "sans-serif"],
        // Legacy names, same stacks.
        montserrat: ["Bricolage Grotesque Variable", "Figtree Variable", "system-ui", "sans-serif"],
        inter: ["Figtree Variable", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Extended JED palette
        jet: "hsl(var(--jet))",
        carbon: "hsl(var(--carbon))",
        charcoal: "hsl(var(--charcoal))",
        arctic: "hsl(var(--arctic))",
        steel: "hsl(var(--steel))",
        ice: "hsl(var(--ice))",
        "soft-white": "hsl(var(--soft-white))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(197 47% 58% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(197 47% 58% / 0.5)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        /* Marquee tracks hold two identical copies of the tiles, so shifting by
           exactly -50% lands copy 2 where copy 1 began — a seamless loop. */
        "marquee-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        /* Drives the conic gradient that reads as a beam travelling the border. */
        "border-beam": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        /* Slides an oversized gradient across a button so the colour drifts
           rather than sitting flat. Paired with bg-[length:200%_100%]. */
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "marquee-left": "marquee-left var(--marquee-duration, 60s) linear infinite",
        "marquee-right": "marquee-right var(--marquee-duration, 60s) linear infinite",
        "border-beam": "border-beam var(--beam-duration, 6s) linear infinite",
        "gradient-flow": "gradient-flow 7s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
