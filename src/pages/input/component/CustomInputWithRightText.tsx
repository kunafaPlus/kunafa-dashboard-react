import * as React from "react";
import { CustomInputWithRightTextProps } from "../utils/type";
import { cn } from "../../../utils/cn";




export const CustomInputWithRightText = React.forwardRef<HTMLInputElement, CustomInputWithRightTextProps>(
  ({ className, label, error, rightText, size = "md", ...props }, ref) => {
    const inputSizeClasses = {
      sm: "h-8 text-sm",
      md: "h-10 text-base",
      lg: "h-12 text-lg"
    };

    const rightTextSizeClasses = {
      sm: "text-sm px-2",
      md: "text-base px-3",
      lg: "text-lg px-4"
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full rounded-md border pr-12",
              inputSizeClasses[size],
              error ? "border-red-500" : "border-gray-300",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              className
            )}
            {...props}
          />
          <div
            className={cn(
              "absolute inset-y-0 right-0 flex items-center border-l",
              rightTextSizeClasses[size],
              error ? "border-red-500" : "border-gray-300",
              "bg-gray-50 text-gray-500"
            )}
          >
            {rightText}
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

CustomInputWithRightText.displayName = "CustomInputWithRightText";
