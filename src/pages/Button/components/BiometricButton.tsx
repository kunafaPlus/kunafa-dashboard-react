import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const biometricButtonVariants = cva(
  "group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      state: {
        idle: "",
        scanning:
          "before:absolute before:inset-0 before:rounded-[inherit] before:border-4 before:border-current before:opacity-20 before:animate-pulse",
        processing:
          "after:absolute after:inset-[3px] after:rounded-full after:border-2 after:border-current after:border-r-transparent after:animate-spin",
        success: "bg-green-500 text-white hover:bg-green-600",
        error: "bg-red-500 text-white hover:bg-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "idle",
    },
  }
);

interface BiometricButtonProps
   {
  onAuthenticate?: () => Promise<boolean>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  authenticateOnMount?: boolean;
  authenticateOnClick?: boolean;
  timeout?: number;
  icon?: React.ReactNode;
  scanningIcon?: React.ReactNode;
  processingIcon?: React.ReactNode;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  className?: string;
  variant?: VariantProps<typeof biometricButtonVariants>["variant"];
  size?: VariantProps<typeof biometricButtonVariants>["size"];
  state?: VariantProps<typeof biometricButtonVariants>["state"];
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}


const BiometricButton = React.forwardRef<HTMLButtonElement, BiometricButtonProps>(
  (
    {
      className,
      variant,
      size,
      state,
      onAuthenticate,
      onSuccess,
      onError,
      authenticateOnMount = false,
      authenticateOnClick = true,
      timeout = 10000,
      icon,
      scanningIcon,
      processingIcon,
      successIcon,
      errorIcon,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [currentState, setCurrentState] = React.useState<
      "idle" | "scanning" | "processing" | "success" | "error"
    >("idle");
    const timeoutRef = React.useRef<number>();

    const authenticate = async () => {
      try {
        setCurrentState("scanning");
        timeoutRef.current = setTimeout(() => {
          setCurrentState("error");
          onError?.(new Error("Authentication timeout"));
        }, timeout);

        const result = await onAuthenticate?.();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (result) {
          setCurrentState("success");
          onSuccess?.();
        } else {
          setCurrentState("error");
          onError?.(new Error("Authentication failed"));
        }
      } catch (error) {
        setCurrentState("error");
        onError?.(error as Error);
      }
    };

    React.useEffect(() => {
      if (authenticateOnMount) {
        authenticate();
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [authenticateOnMount]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (authenticateOnClick && currentState === "idle") {
        await authenticate();
      }
      onClick?.(e);
    };

    const getIcon = () => {
      switch (currentState) {
        case "scanning":
          return (
            scanningIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            )
          );
        case "processing":
          return (
            processingIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )
          );
        case "success":
          return (
            successIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )
          );
        case "error":
          return (
            errorIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )
          );
        default:
          return (
            icon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            )
          );
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          biometricButtonVariants({ variant, size, state: currentState }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {getIcon()}
        {children && <span className="ml-2">{children}</span>}
      </button>
    );
  }
);

BiometricButton.displayName = "BiometricButton";

export { BiometricButton };
