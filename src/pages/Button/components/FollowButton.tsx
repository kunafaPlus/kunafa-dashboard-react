import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const followButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface FollowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof followButtonVariants> {
  following?: boolean;
  showIcon?: boolean;
  animate?: boolean;
  followingText?: string;
  unfollowText?: string;
  loadingText?: string;
  loading?: boolean;
  onFollow?: (following: boolean) => void;
  confirmUnfollow?: boolean;
  confirmMessage?: string;
}

const FollowButton = React.forwardRef<HTMLButtonElement, FollowButtonProps>(
  (
    {
      className,
      variant,
      size,
      following = false,
      showIcon = true,
      animate = true,
      followingText = 'Following',
      unfollowText = 'Follow',
      loadingText = 'Loading...',
      loading = false,
      onFollow,
      confirmUnfollow = true,
      confirmMessage = 'Are you sure you want to unfollow?',
      children,
      ...props
    },
    ref
  ) => {
    const [isFollowing, setIsFollowing] = React.useState(following);
    const [isHovering, setIsHovering] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      setIsFollowing(following);
    }, [following]);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) return;

      event.preventDefault();

      const shouldUnfollow = isFollowing;
      if (shouldUnfollow && confirmUnfollow) {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;
      }

      if (animate) {
        setIsAnimating(true);
        setTimeout(() => { setIsAnimating(false); }, 1000);
      }

      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      onFollow?.(newFollowingState);
    };

    const buttonText = loading
      ? loadingText
      : isFollowing
        ? isHovering && confirmUnfollow
          ? 'Unfollow'
          : followingText
        : unfollowText;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          followButtonVariants({ variant, size }),
          'group gap-2',
          isFollowing &&
            isHovering &&
            confirmUnfollow &&
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          className
        )}
        onClick={handleClick}
        onMouseEnter={() => { setIsHovering(true); }}
        onMouseLeave={() => { setIsHovering(false); }}
        disabled={loading}
        {...props}
      >
        {showIcon && (
          <span
            className={cn(
              'inline-flex transition-transform',
              animate && isAnimating && 'animate-bounce'
            )}
          >
            {loading ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : isFollowing ? (
              isHovering && confirmUnfollow ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM472 200H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H472c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
              )
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
            )}
          </span>
        )}
        {children || buttonText}
      </button>
    );
  }
);

FollowButton.displayName = 'FollowButton';

export { FollowButton };
