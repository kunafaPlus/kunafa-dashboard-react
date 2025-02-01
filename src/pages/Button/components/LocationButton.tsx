import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const locationButtonVariants = cva(
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
        locating:
          "before:absolute before:inset-0 before:rounded-[inherit] before:border-4 before:border-current before:opacity-20 before:animate-pulse",
        success: "bg-green-500 text-white hover:bg-green-600",
        error: "bg-red-500 text-white hover:bg-red-600",
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "idle",
    },
  }
);

interface LocationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof locationButtonVariants> {
  onLocation?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationPositionError) => void;
  watchPosition?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  icon?: React.ReactNode;
  locatingIcon?: React.ReactNode;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  showCoordinates?: boolean;
  coordinatesFormat?: "decimal" | "dms";
}

const LocationButton = React.forwardRef<HTMLButtonElement, LocationButtonProps>(
  (
    {
      className,
      variant,
      size,
      state,
      onLocation,
      onError,
      watchPosition = false,
      enableHighAccuracy = true,
      timeout = 10000,
      maximumAge = 0,
      icon,
      locatingIcon,
      successIcon,
      errorIcon,
      showCoordinates = false,
      coordinatesFormat = "decimal",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [currentState, setCurrentState] = React.useState<
      "idle" | "locating" | "success" | "error" | "disabled"
    >("idle");
    const [coordinates, setCoordinates] = React.useState<{
      latitude: number;
      longitude: number;
    } | null>(null);
    const watchId = React.useRef<number>();

    const formatCoordinates = (lat: number, lng: number) => {
      if (coordinatesFormat === "dms") {
        const formatDMS = (deg: number) => {
          const d = Math.abs(Math.floor(deg));
          const m = Math.abs(Math.floor((deg - d) * 60));
          const s = Math.abs(((deg - d) * 60 - m) * 60).toFixed(2);
          return `${d}°${m}'${s}"`;
        };
        return `${formatDMS(lat)}${lat >= 0 ? "N" : "S"} ${formatDMS(lng)}${
          lng >= 0 ? "E" : "W"
        }`;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    const handleSuccess = (position: GeolocationPosition) => {
      setCurrentState("success");
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      onLocation?.(position);
    };

    const handleError = (error: GeolocationPositionError) => {
      setCurrentState("error");
      onError?.(error);
    };

    const getLocation = () => {
      if (!navigator.geolocation) {
        setCurrentState("disabled");
        onError?.(new GeolocationPositionError());
        return;
      }

      setCurrentState("locating");

      const options: PositionOptions = {
        enableHighAccuracy,
        timeout,
        maximumAge,
      };

      if (watchPosition) {
        watchId.current = navigator.geolocation.watchPosition(
          handleSuccess,
          handleError,
          options
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
          options
        );
      }
    };

    React.useEffect(() => {
      return () => {
        if (watchId.current) {
          navigator.geolocation.clearWatch(watchId.current);
        }
      };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (currentState === "idle") {
        getLocation();
      }
      onClick?.(e);
    };

    const getIcon = () => {
      switch (currentState) {
        case "locating":
          return (
            locatingIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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
          locationButtonVariants({ variant, size, state: currentState }),
          className
        )}
        onClick={handleClick}
        disabled={currentState === "disabled"}
        {...props}
      >
        {getIcon()}
        {children && <span className="ml-2">{children}</span>}
        {showCoordinates && coordinates && (
          <span className="ml-2 text-xs">
            {formatCoordinates(coordinates.latitude, coordinates.longitude)}
          </span>
        )}
      </button>
    );
  }
);

LocationButton.displayName = "LocationButton";

export { LocationButton };
