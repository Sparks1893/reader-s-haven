import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-body",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        // Reading status badges
        reading: "border-transparent bg-bookhive-forest text-primary-foreground",
        completed: "border-transparent bg-bookhive-amber text-bookhive-brown",
        toRead: "border-transparent bg-muted text-muted-foreground",
        paused: "border-transparent bg-bookhive-amber-soft text-bookhive-brown",
        dnf: "border-transparent bg-destructive/20 text-destructive",
        // Spice badge
        spice: "border-transparent bg-bookhive-spice/20 text-bookhive-spice",
        // Achievement badge
        achievement: "border-bookhive-gold bg-bookhive-gold/10 text-bookhive-gold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
