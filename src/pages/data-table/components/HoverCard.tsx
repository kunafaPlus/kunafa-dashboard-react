import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const hoverCardVariants = cva(
  "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "",
        rich: "w-80 p-6",
        compact: "w-48 p-2",
      },
      align: {
        start: "data-[side=bottom]:origin-top-left data-[side=top]:origin-bottom-left",
        center: "",
        end: "data-[side=bottom]:origin-top-right data-[side=top]:origin-bottom-right",
      },
    },
    defaultVariants: {
      variant: "default",
      align: "center",
    },
  }
);

interface HoverCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof hoverCardVariants> {
  trigger: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  (
    {
      className,
      children,
      trigger,
      variant,
      align,
      openDelay = 200,
      closeDelay = 300,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, openDelay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, closeDelay);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
        {isOpen && (
          <div
            ref={ref}
            className={cn(hoverCardVariants({ variant, align }), className)}
            {...props}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

HoverCard.displayName = "HoverCard";

export { HoverCard, hoverCardVariants };
