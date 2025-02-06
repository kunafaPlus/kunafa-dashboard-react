import * as React from "react";
import { cn } from "../../utils/cn";
import { ButtonGroupProps } from "./types/index";

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ 
    className, 
    variant = "default",
    size = "default",
    orientation = "horizontal",
    spacing = "default",
    children,
    ...props 
  }, ref) => {
    const groupedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          variant,
          size,
          className: cn(
            child.props.className,
            "first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none",
            orientation === "vertical" && "w-full first:rounded-b-none last:rounded-t-none"
          ),
        }as any);
      }
      return child;
    });

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === "vertical" && "flex-col",
          spacing === "none" && [
            orientation === "horizontal" && "-space-x-px",
            orientation === "vertical" && "-space-y-px",
          ],
          spacing === "default" && [
            orientation === "horizontal" && "space-x-1",
            orientation === "vertical" && "space-y-1",
          ],
          spacing === "large" && [
            orientation === "horizontal" && "space-x-2",
            orientation === "vertical" && "space-y-2",
          ],
          className
        )}
        {...props}
      >
        {groupedChildren}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };