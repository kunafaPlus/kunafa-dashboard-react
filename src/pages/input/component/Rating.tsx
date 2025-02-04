import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const ratingVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: '',
      bordered: 'p-2 border rounded-md',
      ghost: 'p-2 bg-muted/50 rounded-md',
    },
    size: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  value?: number;
  onChange?: (event: { target: { value: number } }) => void;
  maxStars?: number;
  label?: string;
  error?: string;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, label, error, value = 0, onChange, maxStars = 5, ...props }, ref) => {
    const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

    const handleClick = (rating: number) => {
      if (onChange) {
        onChange({
          target: {
            value: rating,
          },
        });
      }
    };

    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <div className={cn('flex gap-1', error && 'border-red-500', className)} {...props}>
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => { handleClick(star); }}
              className={cn('text-2xl', star <= value ? 'text-yellow-400' : 'text-gray-300')}
            >
              ★
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

export { Rating, ratingVariants };
