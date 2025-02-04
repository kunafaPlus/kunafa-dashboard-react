import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const menuButtonVariants = cva(
  'inline-flex items-center  justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
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

export interface MenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  submenu?: MenuItem[];
  onClick?: () => void;
}

interface MenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuButtonVariants> {
  items: MenuItem[];
  trigger?: React.ReactNode;
  menuClassName?: string;
  itemClassName?: string;
  maxHeight?: number;
  closeOnSelect?: boolean;
  showIcons?: boolean;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  submenuPlacement?: 'right-start' | 'left-start';
  chevronIcon?: React.ReactNode;
}

const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  (
    {
      className,
      variant,
      size,
      items,
      trigger,
      menuClassName,
      itemClassName,
      maxHeight = 250,
      closeOnSelect = true,
      showIcons = true,
      placement = 'bottom-start',
      submenuPlacement = 'right-start',
      chevronIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeSubmenuPath, setActiveSubmenuPath] = React.useState<string[]>([]);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    // Close menu when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setActiveSubmenuPath([]);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

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

    const submenuChevronIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clipRule="evenodd"
        />
      </svg>
    );

    const renderMenuItem = (item: MenuItem, path: string[] = [], isSubmenu = false) => {
      if (item.divider) {
        return <div key={`divider-${path.join('-')}`} className="my-1 h-px bg-white" />;
      }

      const itemPath = [...path, item.id];
      const isActive = activeSubmenuPath.join('-') === itemPath.join('-');

      return (
        <div key={item.id} className="relative">
          <button
            type="button"
            className={cn(
              'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
              {
                'text-destructive': item.danger,
                'opacity-50': item.disabled,
                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground':
                  !item.disabled,
                'bg-white text-accent-foreground': isActive,
              },
              itemClassName
            )}
            disabled={item.disabled}
            onMouseEnter={() => {
              if (item.submenu) {
                setActiveSubmenuPath(itemPath);
              }
            }}
            onClick={() => {
              if (!item.disabled) {
                if (item.submenu) {
                  setActiveSubmenuPath(itemPath);
                } else {
                  item.onClick?.();
                  if (closeOnSelect) {
                    setIsOpen(false);
                    setActiveSubmenuPath([]);
                  }
                }
              }
            }}
          >
            {showIcons && item.icon && <span className="mr-2">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.submenu && submenuChevronIcon}
          </button>

          {/* Submenu */}
          {item.submenu && isActive && (
            <div
              className={cn(
                'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
                {
                  'left-full top-0 ml-1': submenuPlacement === 'right-start',
                  'right-full top-0 mr-1': submenuPlacement === 'left-start',
                }
              )}
            >
              {item.submenu.map((subitem) => renderMenuItem(subitem, itemPath, true))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="relative inline-block text-left">
        <button
          ref={buttonRef}
          type="button"
          className={cn(menuButtonVariants({ variant, size }), 'gap-1', className)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
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
              'absolute z-50 bg-white min-w-[8rem] overflow-hidden rounded-md border border-gray-200 p-1 text-popover-foreground shadow-md',
              {
                'mt-1': placement.startsWith('bottom'),
                'bottom-full mb-1': placement.startsWith('top'),
                'left-0': placement.endsWith('start'),
                'right-0': placement.endsWith('end'),
              },
              menuClassName
            )}
            style={{ maxHeight }}
            onMouseLeave={() => { setActiveSubmenuPath([]); }}
          >
            <div className="overflow-y-auto">{items.map((item) => renderMenuItem(item))}</div>
          </div>
        )}
      </div>
    );
  }
);

MenuButton.displayName = 'MenuButton';

export { MenuButton };
