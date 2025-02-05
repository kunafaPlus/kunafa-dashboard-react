import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const tagStyles = cva(
  // base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        accent: "bg-purple-500 text-white hover:bg-purple-600",
        success: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700/20 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-700/20 dark:text-yellow-400",
        danger: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700/20 dark:text-red-400",
        info: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-700/20 dark:text-blue-400",
      },
      size: {
        xs: "h-5 px-2 text-xs",
        sm: "h-7 px-2.5",
        md: "h-8 px-3",
        lg: "h-9 px-4",
        xl: "h-10 px-5",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "default",
    },
  }
);

interface CustomTagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagStyles> {
  label?: string;
  icon?: React.ReactNode;
}

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