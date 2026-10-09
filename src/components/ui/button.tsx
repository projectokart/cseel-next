'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--btn-radius,12px)] text-sm md:text-[15px] font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand-primary,#006FCC)] text-white hover:bg-[var(--brand-primary-hover,#005499)] shadow-[var(--btn-shadow,0_4px_14px_rgba(0,111,204,0.35))] border-none",
        cseel: "!rounded-[12px] bg-[#006FCC] text-white hover:bg-[#005499] shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_20px_rgba(0,111,204,0.45)] border-none font-bold",
        google: "!rounded-full bg-[#1A73E8] text-white hover:bg-[#1557B0] shadow-[0_1px_3px_rgba(60,64,67,0.3)] hover:shadow-[0_2px_6px_rgba(60,64,67,0.25)] border-none font-medium font-sans",
        destructive: "bg-[#EA4335] text-white hover:bg-[#D93025] shadow-sm",
        outline: "border-2 border-[var(--brand-primary,#006FCC)] bg-white text-[var(--brand-primary,#006FCC)] hover:bg-[var(--brand-secondary-bg,#EDF5FA)]",
        secondary: "bg-[var(--brand-secondary-bg,#EDF5FA)] text-[var(--brand-secondary-text,#006FCC)] hover:bg-[#D6EDFF] hover:text-[#005499] border border-[var(--brand-secondary-border,#D6EDFF)]",
        ghost: "hover:bg-[#F1F3F4] text-[#3C4043]",
        link: "text-[#1A73E8] underline-offset-4 hover:underline font-semibold p-0 h-auto",
      },
      size: {
        default: "h-11 px-6 py-2.5 rounded-[12px]",
        sm: "h-9 rounded-[10px] px-3.5 text-xs",
        lg: "h-12 rounded-[12px] px-8 text-base",
        icon: "h-10 w-10 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
