import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../../utils/cn'

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
      size: {
        default: "",
        sm: "sm:max-w-sm",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        full: "sm:max-w-full",
      },
    },
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
);

interface SheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  open?: boolean;
  onClose?: () => void;
}

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
