import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-none px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#111111] text-white",
        secondary: "bg-neutral-100 text-[#111111]",
        destructive: "bg-[#E53935] text-white",
        outline: "text-[#111111] border border-neutral-300",
        placed: "bg-blue-50 text-blue-700 border border-blue-200",
        shipped: "bg-amber-50 text-amber-700 border border-amber-200",
        delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        cancelled: "bg-rose-50 text-[#E53935] border border-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
