import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { InputGroupContextValue, InputGroupProps } from "./types/type";
import { inputGroupVariants } from "./variants";



 const InputGroupContext = React.createContext<InputGroupContextValue>({});



const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  (
    { className, variant, size, disabled = false, children, ...props },
    ref
  ) => {
    return (
      <InputGroupContext.Provider value={{ variant, size, disabled }}>
        <div
          ref={ref}
          className={cn(inputGroupVariants({ variant, size }as {variant:VariantProps<typeof inputGroupVariants>["variant"], size:VariantProps<typeof inputGroupVariants>["size"]}), className)}
          {...props}
        >
          {children}
        </div>
      </InputGroupContext.Provider>
    );
  }
);

InputGroup.displayName = "InputGroup";

interface InputGroupTextProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "left" | "right";
}

const InputGroupText = React.forwardRef<HTMLDivElement, InputGroupTextProps>(
  ({ className, position = "left", children, ...props }, ref) => {
    const { variant, size, disabled } = React.useContext(InputGroupContext);

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center px-3 bg-gray-100 border-r border-gray-200 text-gray-700",
          position === "left" && "rounded-l-md",
          position === "right" && "rounded-r-md border-l border-gray-200",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

InputGroupText.displayName = "InputGroupText";

interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position?: "left" | "right";
}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, position = "right", children, disabled, ...props }, ref) => {
  const context = React.useContext(InputGroupContext);

  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        position === "left" && "rounded-l-md",
        position === "right" && "rounded-r-md",
        (disabled || context.disabled) &&
          "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled || context.disabled}
      {...props}
    >
      {children}
    </button>
  );
});

InputGroupButton.displayName = "InputGroupButton";

interface InputGroupInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: string;
}

const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, error, disabled, ...props }, ref) => {
    const context = React.useContext(InputGroupContext);

    return (
      <div className="flex-1 min-w-0">
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            error && "border-destructive focus:ring-destructive",
            (disabled || context.disabled) &&
              "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || context.disabled}
          {...props}
        />
        {error && (
          <div className="mt-1 text-sm text-destructive">{error}</div>
        )}
      </div>
    );
  }
);

InputGroupInput.displayName = "InputGroupInput";

export {
  InputGroup,
  InputGroupText,
  InputGroupButton,
  InputGroupInput,
};