import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { LocationButtonProps } from "./types/index";

const LocationButton = React.forwardRef<HTMLButtonElement, LocationButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    loading = false,
    loadingText = "Getting location...",
    errorText = "Location error",
    showError = true,
    onLocationSuccess,
    onLocationError,
    children,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = React.useState(loading);
    const [error, setError] = React.useState<string | null>(null);

    const handleGetLocation = async () => {
      if (!navigator.geolocation) {
        const error = "Geolocation is not supported by your browser";
        setError(error);
        onLocationError?.(new Error(error));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });

        const { latitude, longitude } = position.coords;
        onLocationSuccess?.({ latitude, longitude });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to get location";
        setError(errorMessage);
        onLocationError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="relative inline-flex flex-col items-start">
        <button
          ref={ref}
          onClick={handleGetLocation}
          disabled={isLoading}
          className={cn(
            buttonVariants({ variant, size }),
            "inline-flex items-center gap-2",
            isLoading && "cursor-wait",
            className
          )}
          {...props}
        >
          <span className="relative inline-flex items-center gap-2">
            {!isLoading && (
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
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            )}

            {isLoading && (
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
            )}

            <span>{isLoading ? loadingText : children}</span>
          </span>
        </button>

        {showError && error && (
          <span className="mt-1 text-sm text-destructive">
            {errorText}: {error}
          </span>
        )}
      </div>
    );
  }
);

LocationButton.displayName = "LocationButton";

export { LocationButton };
