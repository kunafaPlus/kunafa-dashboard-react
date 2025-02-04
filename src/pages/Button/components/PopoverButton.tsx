import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const popoverButtonVariants = cva(
  'group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      popoverPosition: {
        top: 'data-[open=true]:before:bottom-full data-[open=true]:before:left-1/2 data-[open=true]:before:-translate-x-1/2 data-[open=true]:before:-translate-y-2',
        bottom:
          'data-[open=true]:before:top-full data-[open=true]:before:left-1/2 data-[open=true]:before:-translate-x-1/2 data-[open=true]:before:translate-y-2',
        left: 'data-[open=true]:before:right-full data-[open=true]:before:top-1/2 data-[open=true]:before:-translate-y-1/2 data-[open=true]:before:-translate-x-2',
        right:
          'data-[open=true]:before:left-full data-[open=true]:before:top-1/2 data-[open=true]:before:-translate-y-1/2 data-[open=true]:before:translate-x-2',
      },
      arrow: {
        none: '',
        top: 'data-[open=true]:after:bottom-full data-[open=true]:after:left-1/2 data-[open=true]:after:-translate-x-1/2 data-[open=true]:after:border-x-transparent data-[open=true]:after:border-t-[var(--popover-bg)] data-[open=true]:after:border-b-0',
        bottom:
          'data-[open=true]:after:top-full data-[open=true]:after:left-1/2 data-[open=true]:after:-translate-x-1/2 data-[open=true]:after:border-x-transparent data-[open=true]:after:border-b-[var(--popover-bg)] data-[open=true]:after:border-t-0',
        left: 'data-[open=true]:after:right-full data-[open=true]:after:top-1/2 data-[open=true]:after:-translate-y-1/2 data-[open=true]:after:border-y-transparent data-[open=true]:after:border-l-[var(--popover-bg)] data-[open=true]:after:border-r-0',
        right:
          'data-[open=true]:after:left-full data-[open=true]:after:top-1/2 data-[open=true]:after:-translate-y-1/2 data-[open=true]:after:border-y-transparent data-[open=true]:after:border-r-[var(--popover-bg)] data-[open=true]:after:border-l-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      popoverPosition: 'bottom',
      arrow: 'bottom',
    },
  }
);

interface PopoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof popoverButtonVariants> {
  popoverContent?: React.ReactNode;
  popoverBg?: string;
  popoverColor?: string;
  popoverWidth?: string;
  popoverPadding?: string;
  popoverRadius?: string;
  popoverShadow?: string;
  popoverZIndex?: number;
  icon?: React.ReactNode;
  closeOnClick?: boolean;
  closeOnClickOutside?: boolean;
  openOnHover?: boolean;
}

const PopoverButton = React.forwardRef<HTMLButtonElement, PopoverButtonProps>(
  (
    {
      className,
      variant,
      size,
      popoverPosition,
      arrow,
      popoverContent,
      popoverBg = 'white',
      popoverColor = 'inherit',
      popoverWidth = 'max-content',
      popoverPadding = '1rem',
      popoverRadius = '0.5rem',
      popoverShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      popoverZIndex = 50,
      icon,
      closeOnClick = true,
      closeOnClickOutside = true,
      openOnHover = false,
      children,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      if (closeOnClickOutside && isOpen) {
        const handleClickOutside = (event: MouseEvent) => {
          if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [closeOnClickOutside, isOpen]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!openOnHover) {
        setIsOpen(!isOpen);
      }
      if (closeOnClick && isOpen) {
        setIsOpen(false);
      }
      onClick?.(e);
    };

    const customStyle = {
      ...style,
      '--popover-bg': popoverBg,
      '--popover-color': popoverColor,
      '--popover-width': popoverWidth,
      '--popover-padding': popoverPadding,
      '--popover-radius': popoverRadius,
      '--popover-shadow': popoverShadow,
      '--popover-z-index': popoverZIndex,
    } as React.CSSProperties;

    return (
      <button
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          buttonRef.current = node;
        }}
        type="button"
        className={cn(
          popoverButtonVariants({ variant, size, popoverPosition, arrow }),
          'before:absolute before:z-[var(--popover-z-index)] before:w-[var(--popover-width)] before:rounded-[var(--popover-radius)] before:bg-[var(--popover-bg)] before:p-[var(--popover-padding)] before:text-[var(--popover-color)] before:shadow-[var(--popover-shadow)] before:transition-all before:duration-200 before:content-[attr(data-popover)] data-[open=true]:before:opacity-100 before:opacity-0 before:pointer-events-none data-[open=true]:before:pointer-events-auto',
          arrow !== 'none' &&
            'after:absolute after:z-[var(--popover-z-index)] after:h-0 after:w-0 after:border-[6px] after:transition-all after:duration-200 data-[open=true]:after:opacity-100 after:opacity-0',
          openOnHover && 'hover:before:opacity-100 hover:after:opacity-100',
          className
        )}
        style={customStyle}
        data-popover={popoverContent}
        data-open={isOpen}
        onClick={handleClick}
        onMouseEnter={() => openOnHover && setIsOpen(true)}
        onMouseLeave={() => openOnHover && setIsOpen(false)}
        {...props}
      >
        {icon ? <span className="grid h-full place-items-center">{icon}</span> : children}
      </button>
    );
  }
);

PopoverButton.displayName = 'PopoverButton';

export { PopoverButton };
