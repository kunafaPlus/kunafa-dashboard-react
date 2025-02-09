import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { FollowButtonProps } from "./types/index";

const FollowButton = React.forwardRef<HTMLButtonElement, FollowButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    isFollowing = false,
    onFollow,
    onUnfollow,
    followingText = "Following",
    unfollowText = "Follow",
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);

    const handleClick = async () => {
      try {
        setIsPending(true);
        if (isFollowing) {
          await onUnfollow?.();
        } else {
          await onFollow?.();
        }
      } catch (error) {
        console.error('Follow action failed:', error);
      } finally {
        setIsPending(false);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isPending}
        className={cn(
          buttonVariants({ 
            variant: isFollowing ? "outline" : variant,
            size 
          }),
          isFollowing && isHovered && "bg-destructive/10 text-destructive hover:bg-destructive/20",
          "inline-flex items-center gap-2 transition-all duration-200",
          className
        )}
        {...props}
      >
        {isPending ? (
          <>
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
            {isFollowing ? "Unfollowing..." : "Following..."}
          </>
        ) : (
          <>
            {isFollowing ? (
              <>
                {isHovered ? (
                  <>
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Unfollow
                  </>
                ) : (
                  <>
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
                    {followingText}
                  </>
                )}
              </>
            ) : (
              <>
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                {children || unfollowText}
              </>
            )}
          </>
        )}
      </button>
    );
  }
);

FollowButton.displayName = "FollowButton";

export { FollowButton };
