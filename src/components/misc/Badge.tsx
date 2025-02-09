import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../utils/cn";
import { badgeVariants } from "./variants";



export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
