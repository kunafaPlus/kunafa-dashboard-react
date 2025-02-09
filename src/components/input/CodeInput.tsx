import * as React from "react";
import { cn } from "../../utils/cn";
import { CodeInputProps } from "./types/type";




const CodeInput = React.forwardRef<HTMLTextAreaElement, CodeInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className={cn(
          "border rounded-md overflow-hidden",
          error && "border-red-500",
          className
        )}>
          <textarea
            ref={ref}
            className="w-full p-3 font-mono"
            {...props}
          />
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

CodeInput.displayName = "CodeInput";

export { CodeInput };