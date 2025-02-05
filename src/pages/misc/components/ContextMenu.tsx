import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const contextMenuVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "border-none shadow-none",
      },
      size: {
        sm: "min-w-[8rem]",
        md: "min-w-[12rem]",
        lg: "min-w-[16rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const contextMenuItemVariants = cva(
  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "text-destructive hover:bg-destructive hover:text-destructive-foreground",
      },
      inset: {
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inset: false,
    },
  }
);

interface ContextMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof contextMenuVariants> {
  trigger: React.ReactNode;
}

interface ContextMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof contextMenuItemVariants> {
  icon?: React.ReactNode;
  shortcut?: string;
}

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ className, children, trigger, variant, size, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const menuRef = React.useRef<HTMLDivElement>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
      event.preventDefault();
      const x = event.clientX;
      const y = event.clientY;

      // Adjust position if menu would go off screen
      const menuWidth = menuRef.current?.offsetWidth || 0;
      const menuHeight = menuRef.current?.offsetHeight || 0;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const adjustedX = x + menuWidth > windowWidth ? x - menuWidth : x;
      const adjustedY = y + menuHeight > windowHeight ? y - menuHeight : y;

      setPosition({ x: adjustedX, y: adjustedY });
      setIsOpen(true);
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    return (
      <>
        <div onContextMenu={handleContextMenu}>{trigger}</div>
        {isOpen && (
          <div
            ref={mergeRefs(ref, menuRef)}
            className={cn(contextMenuVariants({ variant, size }), className)}
            style={{
              position: "fixed",
              top: position.y,
              left: position.x,
            }}
            data-state={isOpen ? "open" : "closed"}
            {...props}
          >
            {children}
          </div>
        )}
      </>
    );
  }
);

const ContextMenuItem = React.forwardRef<HTMLButtonElement, ContextMenuItemProps>(
  ({ className, children, variant, inset, icon, shortcut, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(contextMenuItemVariants({ variant, inset }), className)}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        {shortcut && (
          <span className="ml-auto text-xs tracking-widest opacity-60">
            {shortcut}
          </span>
        )}
      </button>
    );
  }
);

const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));

// Utility function to merge refs
function mergeRefs<T>(...refs: Array<React.Ref<T>>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

ContextMenu.displayName = "ContextMenu";
ContextMenuItem.displayName = "ContextMenuItem";
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export { ContextMenu, ContextMenuItem, ContextMenuSeparator };
