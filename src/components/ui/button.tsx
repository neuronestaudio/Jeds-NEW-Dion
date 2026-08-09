import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Shared by the gradient variants below.
 *
 * `[transition-duration:300ms]` rather than `duration-300`: tailwindcss-animate
 * makes the `duration-*` utilities set `animation-duration` as well, which would
 * pin `animate-gradient-flow` at 300ms and make the gradient strobe.
 *
 * The sweep is a ::before overlay, so children are lifted above it with
 * `[&>*]:relative [&>*]:z-10` — without that the highlight passes over the label
 * instead of behind it.
 */
const FLOW =
  "relative overflow-hidden bg-[length:200%_100%] animate-gradient-flow " +
  "before:content-[''] before:absolute before:inset-0 before:-translate-x-full " +
  "before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent " +
  "before:[transition:transform_0.7s_ease] hover:before:translate-x-full " +
  "[&>*]:relative [&>*]:z-10 " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] " +
  "motion-reduce:animate-none motion-reduce:hover:translate-y-0";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all [transition-duration:300ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent hover:bg-card hover:border-primary/50 hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: 
          "hover:bg-card hover:text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
        hero:
          `${FLOW} text-primary-foreground font-bold shadow-lg ` +
          // Light band mid-gradient so the drift is legible, not just a fade.
          "bg-[linear-gradient(110deg,hsl(var(--secondary)),hsl(var(--primary))_35%,hsl(197_72%_74%)_50%,hsl(var(--primary))_65%,hsl(var(--secondary)))] " +
          "hover:shadow-[0_12px_32px_hsl(var(--primary)/0.45)]",
        heroOutline:
          "relative overflow-hidden border-2 border-foreground/80 bg-transparent text-foreground font-bold " +
          "hover:bg-foreground/10 hover:border-foreground hover:-translate-y-0.5 active:translate-y-0 " +
          "before:content-[''] before:absolute before:inset-0 before:-translate-x-full " +
          "before:bg-gradient-to-r before:from-transparent before:via-foreground/15 before:to-transparent " +
          "before:[transition:transform_0.7s_ease] hover:before:translate-x-full " +
          "[&>*]:relative [&>*]:z-10 motion-reduce:hover:translate-y-0",
        cta:
          `${FLOW} text-primary-foreground font-bold shadow-lg ` +
          "bg-[linear-gradient(110deg,hsl(var(--primary)),hsl(var(--secondary))_50%,hsl(var(--primary)))] " +
          "hover:shadow-[0_12px_32px_hsl(var(--primary)/0.45)]",
        ctaSecondary:
          "bg-card border border-primary/50 text-primary font-semibold hover:bg-primary/10 hover:border-primary hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
        call:
          `${FLOW} text-white font-bold shadow-lg ` +
          "bg-[linear-gradient(110deg,#15803d,#22c55e_50%,#15803d)] " +
          "hover:shadow-[0_12px_32px_rgba(34,197,94,0.45)]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-13 rounded-xl px-8 py-3 text-base",
        xl: "h-14 rounded-xl px-10 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
