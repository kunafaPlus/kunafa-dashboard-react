import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { MenuButtonProps } from "./types//index";

const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ 
    className, 
    variant = "ghost", 
    size = "icon",
    isOpen = false,
    onToggle,
    renderMenu,
    children,
    ...props 
  }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(isOpen);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      setIsMenuOpen(isOpen);
    }, [isOpen]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
          onToggle?.(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onToggle]);

    const handleToggle = () => {
      const newState = !isMenuOpen;
      setIsMenuOpen(newState);
      onToggle?.(newState);
    };

    return (
      <div className="relative" ref={menuRef}>
        <button
          ref={ref}
          onClick={handleToggle}
          className={cn(
            buttonVariants({ variant, size }),
            "inline-flex items-center gap-2",
            className
          )}
          {...props}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", isMenuOpen && "rotate-90")}
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          {children}
        </button>

        {isMenuOpen && renderMenu && (
          <div className="absolute right-0 z-50 mt-2 min-w-[200px] rounded-md bg-background shadow-md ring-1 ring-black ring-opacity-5">
            {renderMenu()}
          </div>
        )}
      </div>
    );
  }
);

MenuButton.displayName = "MenuButton";

export { MenuButton };
