import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const likeButtonVariants = cva(
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
      variant: 'ghost',
      size: 'default',
    },
  }
);

interface LikeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof likeButtonVariants> {
  liked?: boolean;
  count?: number;
  showCount?: boolean;
  showIcon?: boolean;
  animate?: boolean;
  likedColor?: string;
  onLike?: (liked: boolean) => void;
}

const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  (
    {
      className,
      variant,
      size,
      liked = false,
      count = 0,
      showCount = true,
      showIcon = true,
      animate = true,
      likedColor = '#ef4444',
      onLike,
      children,
      ...props
    },
    ref
  ) => {
    const [isLiked, setIsLiked] = React.useState(liked);
    const [likeCount, setLikeCount] = React.useState(count);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      setIsLiked(liked);
    }, [liked]);

    React.useEffect(() => {
      setLikeCount(count);
    }, [count]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (animate) {
        setIsAnimating(true);
        setTimeout(() => { setIsAnimating(false); }, 1000);
      }

      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount((prev) => prev + (newLikedState ? 1 : -1));
      onLike?.(newLikedState);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(likeButtonVariants({ variant, size }), 'group gap-2', className)}
        onClick={handleClick}
        {...props}
      >
        {showIcon && (
          <span
            className={cn(
              'inline-flex transition-transform',
              animate && isAnimating && 'animate-heartbeat',
              isLiked && 'scale-110'
            )}
            style={{ color: isLiked ? likedColor : 'currentColor' }}
          >
            {isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="32"
              >
                <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 94.22 157.6 82.07 127.8 88.02C82.79 96.23 48 138.3 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.3 429.2 96.23 384.2 88.02C354.4 82.07 323.6 94.22 301.9 117.1L255.1 163.9z" />
              </svg>
            )}
          </span>
        )}
        {children}
        {showCount && (
          <span className={cn('transition-colors', isLiked && 'text-[#ef4444]')}>
            {likeCount > 0 ? likeCount : ''}
          </span>
        )}
      </button>
    );
  }
);

LikeButton.displayName = 'LikeButton';

export { LikeButton };
