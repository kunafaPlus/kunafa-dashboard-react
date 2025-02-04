import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const splitButtonVariants = cva('inline-flex rounded-md shadow-sm', {
  variants: {
    variant: {
      default:
        '[&>*:first-child]:bg-primary [&>*:first-child]:text-white [&>*:first-child]:hover:bg-primary/90 [&>*:last-child]:bg-primary [&>*:last-child]:text-white [&>*:last-child]:hover:bg-primary/90',
      destructive:
        '[&>*:first-child]:bg-destructive [&>*:first-child]:text-destructive-foreground [&>*:first-child]:hover:bg-destructive/90 [&>*:last-child]:bg-destructive [&>*:last-child]:text-destructive-foreground [&>*:last-child]:hover:bg-destructive/90',
      outline:
        '[&>*:first-child]:border [&>*:first-child]:border-input [&>*:first-child]:bg-background [&>*:first-child]:hover:bg-accent [&>*:first-child]:hover:text-accent-foreground [&>*:last-child]:border [&>*:last-child]:border-input [&>*:last-child]:bg-background [&>*:last-child]:hover:bg-accent [&>*:last-child]:hover:text-accent-foreground',
      secondary:
        '[&>*:first-child]:bg-secondary [&>*:first-child]:text-secondary-foreground [&>*:first-child]:hover:bg-secondary/80 [&>*:last-child]:bg-secondary [&>*:last-child]:text-secondary-foreground [&>*:last-child]:hover:bg-secondary/80',
      ghost:
        '[&>*:first-child]:hover:bg-accent [&>*:first-child]:hover:text-accent-foreground [&>*:last-child]:hover:bg-accent [&>*:last-child]:hover:text-accent-foreground',
    },
    size: {
      default:
        '[&>*:first-child]:h-9 [&>*:first-child]:px-4 [&>*:first-child]:py-2 [&>*:last-child]:h-9 [&>*:last-child]:w-9',
      sm: '[&>*:first-child]:h-8 [&>*:first-child]:px-3 [&>*:first-child]:text-xs [&>*:last-child]:h-8 [&>*:last-child]:w-8 [&>*:last-child]:text-xs',
      lg: '[&>*:first-child]:h-10 [&>*:first-child]:px-8 [&>*:last-child]:h-10 [&>*:last-child]:w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
}

interface SplitButtonProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitButtonVariants> {
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  menuClassName?: string;
  itemClassName?: string;
  maxHeight?: number;
  closeOnSelect?: boolean;
  showIcons?: boolean;
  loading?: boolean;
  loadingText?: string;
  onMainClick?: () => void;
  mainDisabled?: boolean;
  dropdownDisabled?: boolean;
}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      variant,
      size,
      items,
      placement = 'bottom-end',
      menuClassName,
      itemClassName,
      maxHeight = 250,
      closeOnSelect = true,
      showIcons = true,
      loading = false,
      loadingText,
      onMainClick,
      mainDisabled = false,
      dropdownDisabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          triggerRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    return (
      <div ref={ref} className={cn(splitButtonVariants({ variant, size }), className)} {...props}>
        {/* Main Button */}
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-l-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            loading && 'cursor-wait'
          )}
          onClick={onMainClick}
          disabled={mainDisabled || loading}
          aria-disabled={mainDisabled || loading}
        >
          {loading && (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
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
          )}
          {loading ? loadingText || children : children}
        </button>

        {/* Dropdown Trigger */}
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-r-md border-l text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            variant === 'outline' && 'border-l-input'
          )}
          onClick={() => !dropdownDisabled && setIsOpen(!isOpen)}
          disabled={dropdownDisabled || loading}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              'absolute z-50 -bottom-5 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',

              menuClassName
            )}
            style={{ maxHeight }}
          >
            <div className="overflow-y-auto">
              {items.map((item, index) => {
                if (item.divider) {
                  return <div key={`divider-${index}`} className="my-1 h-px bg-muted" />;
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                      {
                        'text-destructive': item.danger,
                        'opacity-50': item.disabled,
                        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground':
                          !item.disabled,
                      },
                      itemClassName
                    )}
                    disabled={item.disabled}
                    onClick={() => {
                      if (!item.disabled) {
                        item.onClick?.();
                        if (closeOnSelect) {
                          setIsOpen(false);
                        }
                      }
                    }}
                  >
                    {showIcons && item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SplitButton.displayName = 'SplitButton';

export { SplitButton };
