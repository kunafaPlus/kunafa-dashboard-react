import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { NotificationButtonProps } from "./types/index";

const NotificationButton = React.forwardRef<HTMLButtonElement, NotificationButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    count = 0,
    maxCount = 99,
    showZero = false,
    showDot = false,
    dotColor = "bg-red-500",
    badgeClassName,
    onNotificationClick,
    children,
    ...props 
  }, ref) => {
    const [permission, setPermission] = React.useState<NotificationPermission>(
      typeof Notification !== "undefined" ? Notification.permission : "default"
    );

    React.useEffect(() => {
      if (typeof Notification !== "undefined") {
        setPermission(Notification.permission);
      }
    }, []);

    const requestPermission = async () => {
      if (typeof Notification === "undefined") {
        console.warn("Notifications are not supported in this environment");
        return;
      }

      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === "granted") {
          onNotificationClick?.();
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (permission === "default") {
        requestPermission();
      } else if (permission === "granted") {
        onNotificationClick?.(event);
      }
    };

    const displayCount = count > maxCount ? `${maxCount}+` : count;

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant, size }),
          "relative inline-flex items-center",
          className
        )}
        {...props}
      >
        {(showDot || (count > 0 || showZero)) && (
          <span
            className={cn(
              "absolute -right-1 -top-1 flex items-center justify-center",
              showDot
                ? cn("h-2 w-2 rounded-full", dotColor)
                : cn(
                    "min-w-[1.25rem] rounded-full bg-red-500 px-1 py-0.5 text-xs font-medium text-white",
                    badgeClassName
                  )
            )}
          >
            {!showDot && (count > 0 || showZero) && displayCount}
          </span>
        )}

        <span className="relative inline-flex items-center gap-2">
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {children}
        </span>
      </button>
    );
  }
);

NotificationButton.displayName = "NotificationButton";

export { NotificationButton };
