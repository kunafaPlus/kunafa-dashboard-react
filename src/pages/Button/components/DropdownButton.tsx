import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const dropdownButtonVariants = cva(
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

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  value?: any;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick?: (value?: any) => void;
}

interface DropdownButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dropdownButtonVariants> {
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  trigger?: React.ReactNode;
  menuClassName?: string;
  itemClassName?: string;
  maxHeight?: number;
  closeOnSelect?: boolean;
  showIcons?: boolean;
  chevronIcon?: React.ReactNode;
  onSelect?: (value: any) => void;
}

const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  (
    {
      className,
      variant,
      size,
      items,
      placement = 'bottom-start',
      trigger,
      menuClassName,
      itemClassName,
      maxHeight = 250,
      closeOnSelect = true,
      showIcons = true,
      chevronIcon,
      children,
      disabled,
      onSelect,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<any>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    // Handle item click
    const handleItemClick = (item: DropdownItem) => {
      if (item.disabled) return;

      if (item.value !== undefined) {
        setSelectedValue(item.value);
        onSelect?.(item.value);
      }

      if (item.onClick) {
        item.onClick(item.value);
      }

      if (closeOnSelect) {
        setIsOpen(false);
      }
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const defaultChevronIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    );

    return (
      <div className="relative inline-block text-left">
        <button
          ref={buttonRef}
          type="button"
          className={cn(dropdownButtonVariants({ variant, size }), className)}
          onClick={() => { setIsOpen(!isOpen); }}
          disabled={disabled}
          {...props}
        >
          {trigger || children}
          {chevronIcon || defaultChevronIcon}
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              'absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
              menuClassName,
              {
                'origin-top-right right-0': placement === 'bottom-end',
                'origin-top-left left-0': placement === 'bottom-start',
                'origin-bottom-right right-0 bottom-full': placement === 'top-end',
                'origin-bottom-left left-0 bottom-full': placement === 'top-start',
              }
            )}
            style={{ maxHeight: maxHeight, overflowY: 'auto' }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            onKeyDown={handleKeyDown}
          >
            <div className="py-1" role="none">
              {items.map((item, index) => {
                if (item.divider) {
                  return <hr key={index} className="my-1 border-gray-200" />;
                }

                return (
                  <button
                    key={item.id}
                    className={cn(
                      'flex w-full items-center px-4 py-2 text-sm',
                      {
                        'text-gray-900 hover:bg-gray-100': !item.danger,
                        'text-red-600 hover:bg-red-50': item.danger,
                        'opacity-50 cursor-not-allowed': item.disabled,
                      },
                      itemClassName
                    )}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => { handleItemClick(item); }}
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

DropdownButton.displayName = 'DropdownButton';

export default DropdownButton;
