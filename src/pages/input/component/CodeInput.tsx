import * as React from "react";
import { cn } from "../../../utils/cn";


interface CodeInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  label?: string;
  error?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  hint?: string;
  minHeight?: number;
  maxHeight?: number;
  autoFocus?: boolean;
  placeholder?: string;
  onSave?: (value: string) => void;
  onFormat?: (value: string) => string;
  extensions?: any[];
}

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