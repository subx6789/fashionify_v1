import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#111111] text-white hover:bg-neutral-800 active:scale-[0.99]",
        destructive: "bg-[#E53935] text-white hover:bg-red-700",
        outline: "border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white",
        secondary: "bg-neutral-100 text-[#111111] hover:bg-neutral-200",
        ghost: "hover:bg-neutral-100 text-[#111111]",
        link: "text-[#111111] underline-offset-4 hover:underline lowercase tracking-normal",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-[12px]",
        lg: "h-12 px-8 text-[14px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
