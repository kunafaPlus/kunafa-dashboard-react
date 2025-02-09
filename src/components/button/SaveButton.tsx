import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { SaveButtonProps } from "./types";

const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    loading = false,
    saved = false,
    showIcon = true,
    loadingText = "Saving...",
    savedText,
    onSave,
    children,
    ...props 
  }, ref) => {
    const [isSaving, setIsSaving] = React.useState(loading);
    const [hasSaved, setHasSaved] = React.useState(saved);
    const timeoutRef = React.useRef<number>();

    React.useEffect(() => {
      setIsSaving(loading);
    }, [loading]);

    React.useEffect(() => {
      setHasSaved(saved);
      if (saved) {
        timeoutRef.current = window.setTimeout(() => {
          setHasSaved(false);
        }, 2000);
      }
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [saved]);

    const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        setIsSaving(true);
        await onSave?.(event);
        setHasSaved(true);
        timeoutRef.current = window.setTimeout(() => {
          setHasSaved(false);
        }, 2000);
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleSave}
        disabled={isSaving}
        className={cn(
          buttonVariants({ variant, size }),
          "relative inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        {showIcon && (
          <>
            {isSaving ? (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : hasSaved ? (
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
                <path d="M20 6L9 17l-5-5" />
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
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            )}
          </>
        )}
        {isSaving ? loadingText : hasSaved ? (savedText || "Saved!") : children}
      </button>
    );
  }
);

SaveButton.displayName = "SaveButton";

export { SaveButton };
