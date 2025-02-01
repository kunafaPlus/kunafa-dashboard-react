import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const buttonGroupVariants = cva(
  "inline-flex items-center  justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "[&>*]:bg-primary [&>*]:text-white [&>*:hover]:bg-primary/90",
        destructive:
          "[&>*]:bg-destructive [&>*]:text-destructive-foreground [&>*:hover]:bg-destructive/90",
        outline:
          "[&>*]:border [&>*]:border-input [&>*]:bg-background [&>*:hover]:bg-accent [&>*:hover]:text-accent-foreground",
        secondary:
          "[&>*]:bg-secondary [&>*]:text-secondary-foreground [&>*:hover]:bg-secondary/80",
        ghost: "[&>*:hover]:bg-accent [&>*:hover]:text-accent-foreground",
        link: "[&>*]:text-primary [&>*]:underline-offset-4 [&>*:hover]:underline",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
      size: {
        default: "[&>*]:h-9 [&>*]:px-4 [&>*]:py-2",
        sm: "[&>*]:h-8 [&>*]:px-3 [&>*]:text-xs",
        lg: "[&>*]:h-10 [&>*]:px-8",
        icon: "[&>*]:h-9 [&>*]:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
      size: "default",
    },
  }
);

interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  attached?: boolean;
  fullWidth?: boolean;
  gap?: number;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      variant,
      orientation,
      size,
      attached = true,
      fullWidth = false,
      gap = 0,
      children,
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children);

    return (
      <div
        ref={ref}
        className={cn(
          buttonGroupVariants({ variant, orientation, size }),
          attached
            ? orientation === "horizontal"
              ? "[&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:rounded-l-none"
              : "[&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:rounded-t-none"
            : "",
          fullWidth && "w-full",
          className
        )}
        style={{
          gap: `${gap * 0.25}rem`, // Convert gap to rem (assuming gap is in multiples of 0.25rem)
        }}
        {...props}
      >
        {childrenArray.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              key: index,
              className: cn(
                child.props.className,
                !attached && "rounded-md",
                "-mx-1"
              ),
            });
          }
          return child;
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };