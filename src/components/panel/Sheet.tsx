import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../utils/cn'
import { SheetProps } from "./types";
import { sheetVariants } from "./variants";




const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, children, side, size, open, onClose, ...props }, ref) => {
    return (
      <>
        {open && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/20"
              onClick={onClose}
            />
            <div
              ref={ref}
              data-state={open ? "open" : "closed"}
              className={cn(sheetVariants({ side, size }), className)}
              {...props}
            >
              {children}
            </div>
          </>
        )}
      </>
    );
  }
);

Sheet.displayName = "Sheet";

export { Sheet, sheetVariants };
