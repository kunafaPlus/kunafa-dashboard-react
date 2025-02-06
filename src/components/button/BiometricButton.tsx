import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { BiometricButtonProps } from "./types/index";

const BiometricButton = React.forwardRef<HTMLButtonElement, BiometricButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default",
    onAuthenticate,
    onError,
    promptMessage = "Authenticate using biometrics",
    children,
    ...props 
  }, ref) => {
    const [isSupported, setIsSupported] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
      const checkSupport = async () => {
        try {
          // Check if the Web Authentication API is available
          if (window.PublicKeyCredential) {
            setIsSupported(true);
          }
        } catch (error) {
          console.error("Biometric authentication not supported:", error);
          setIsSupported(false);
        }
      };

      checkSupport();
    }, []);

    const handleAuthenticate = async () => {
      if (!isSupported) {
        onError?.("Biometric authentication not supported");
        return;
      }

      setIsLoading(true);
      try {
        // Request biometric authentication
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            rpId: window.location.hostname,
            userVerification: "required",
          },
        });

        if (credential) {
          onAuthenticate?.(credential);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        onError?.(error instanceof Error ? error.message : "Authentication failed");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleAuthenticate}
        disabled={!isSupported || isLoading}
        className={cn(
          buttonVariants({ variant, size }),
          "inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("h-4 w-4", isLoading && "animate-spin")}
        >
          <path d="M12 2a10 10 0 0 0-6.88 2.77M12 2v4M12 2a10 10 0 0 1 6.88 2.77" />
          <path d="M8.5 8a3.5 3.5 0 0 1 3.5 3.5" />
          <path d="M15.5 8a3.5 3.5 0 0 0-3.5 3.5" />
          <path d="M3 10a7 7 0 0 1 7-7" />
          <path d="M21 10a7 7 0 0 0-7-7" />
          <path d="M12 18.5V22" />
        </svg>
        {children || (isLoading ? "Authenticating..." : "Authenticate")}
      </button>
    );
  }
);

BiometricButton.displayName = "BiometricButton";

export { BiometricButton };
