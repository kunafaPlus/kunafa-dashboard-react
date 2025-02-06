import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { CopyButtonProps } from "./types/index";

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ 
    className, 
    variant = "ghost", 
    size = "icon",
    value,
    timeout = 2000,
    onCopy,
    children,
    ...props 
  }, ref) => {
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
      if (copied) {
        const timer = setTimeout(() => {
          setCopied(false);
        }, timeout);

        return () => clearTimeout(timer);
      }
    }, [copied, timeout]);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.(value);
      } catch (error) {
        console.error("Failed to copy text:", error);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleCopy}
        className={cn(
          buttonVariants({ variant, size }),
          "inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
        {children || (copied ? "Copied!" : "Copy")}
      </button>
    );
  }
);

CopyButton.displayName = "CopyButton";

export { CopyButton };
