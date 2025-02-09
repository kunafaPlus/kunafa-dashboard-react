import React from "react";
import { twMerge } from "tailwind-merge";
import { CustomTagProps } from "./types";
import { tagStyles } from "./variants";





const CustomTag = React.forwardRef<HTMLDivElement, CustomTagProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      label,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          tagStyles({
            variant,
            size,
            shape,
          }),
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1.5">{icon}</span>}
        {label || children}
      </div>
    );
  }
);

CustomTag.displayName = "CustomTag";

export { CustomTag, type CustomTagProps, tagStyles };