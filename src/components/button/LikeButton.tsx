import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { LikeButtonProps } from "./types/index";

const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  ({ 
    className,
    variant = "ghost",
    size = "icon",
    isLiked = false,
    count = 0,
    showCount = true,
    animated = true,
    onLike,
    onUnlike,
    children,
    ...props 
  }, ref) => {
    const [liked, setLiked] = React.useState(isLiked);
    const [likeCount, setLikeCount] = React.useState(count);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      setLiked(isLiked);
      setLikeCount(count);
    }, [isLiked, count]);

    const handleClick = async () => {
      try {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
        
        if (animated) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        }

        if (newLikedState) {
          await onLike?.();
        } else {
          await onUnlike?.();
        }
      } catch (error) {
        // Revert on error
        setLiked(!liked);
        setLikeCount(prev => liked ? prev + 1 : prev - 1);
        console.error('Like action failed:', error);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant, size }),
          "group relative inline-flex items-center gap-2",
          liked && "text-red-500",
          className
        )}
        {...props}
      >
        <span className="relative inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "h-5 w-5 transition-all duration-300",
              liked && "fill-current",
              isAnimating && liked && "animate-heartbeat"
            )}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {isAnimating && liked && (
            <span className="absolute left-0 top-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 animate-ping text-red-500/30"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
          )}
        </span>
        {showCount && (
          <span className={cn(
            "text-sm transition-colors duration-300",
            liked && "text-red-500"
          )}>
            {likeCount}
          </span>
        )}
        {children}
      </button>
    );
  }
);

LikeButton.displayName = "LikeButton";

export { LikeButton };
