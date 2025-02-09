import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { SocialButtonProps } from "./types";

const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    provider = "google",
    loading = false,
    showIcon = true,
    onSuccess,
    onError,
    children,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = React.useState(loading);

    const icons = {
      google: (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      ),
      github: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      facebook: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      twitter: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      apple: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M14.94 5.19A4.38 4.38 0 0016 2a4.38 4.38 0 00-3 1.52 4.09 4.09 0 00-1 3 3.62 3.62 0 002.94-1.33zm2 3.03a4.51 4.51 0 012.16 3.78 4.47 4.47 0 01-2.16 3.78 10.25 10.25 0 01-1.07-2.17 4.46 4.46 0 002.16-3.78 4.47 4.47 0 00-2.16-3.78 10.25 10.25 0 011.07 2.17zM12 8.1a4.51 4.51 0 014.51 4.51A4.51 4.51 0 0112 17.12a4.51 4.51 0 01-4.51-4.51A4.51 4.51 0 0112 8.1zm0 11.72c2.1 0 4.2-.42 6.29-1.26a4.46 4.46 0 002.16-3.78 4.47 4.47 0 00-2.16-3.78 10.25 10.25 0 00-1.07 2.17 4.46 4.46 0 012.16 3.78 4.47 4.47 0 01-2.16 3.78A14.79 14.79 0 0112 21.9z" />
        </svg>
      ),
    };

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        setIsLoading(true);
        await onSuccess?.(event);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          buttonVariants({ variant, size }),
          "relative inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="h-5 w-5 animate-spin"
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
        ) : (
          showIcon && icons[provider]
        )}
        {children}
      </button>
    );
  }
);

SocialButton.displayName = "SocialButton";

export { SocialButton };
