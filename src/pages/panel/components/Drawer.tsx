import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../../utils/cn'

const drawerVariants = cva(
  "fixed z-50 bg-background shadow-lg transition-transform duration-300 ease-in-out",
  {
    variants: {
      position: {
        left: "inset-y-0 left-0 h-full transform -translate-x-full data-[state=open]:translate-x-0",
        right: "inset-y-0 right-0 h-full transform translate-x-full data-[state=open]:translate-x-0",
        top: "inset-x-0 top-0 w-full transform -translate-y-full data-[state=open]:translate-y-0",
        bottom:
          "inset-x-0 bottom-0 w-full transform translate-y-full data-[state=open]:translate-y-0",
      },
      size: {
        sm: "w-64",
        md: "w-80",
        lg: "w-96",
        xl: "w-1/2",
        full: "w-screen",
      },
    },
    defaultVariants: {
      position: "right",
      size: "md",
    },
  }
);

const drawerOverlayVariants = cva(
  "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in",
  {
    variants: {
      variant: {
        default: "",
        blur: "backdrop-blur-sm",
        dark: "bg-black/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open?: boolean;
  onClose?: () => void;
  showOverlay?: boolean;
  overlayVariant?: VariantProps<typeof drawerOverlayVariants>["variant"];
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      children,
      position,
      size,
      open = false,
      onClose,
      showOverlay = true,
      overlayVariant = "default",
      closeOnOverlayClick = true,
      closeOnEsc = true,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape" && closeOnEsc) {
          onClose?.();
        }
      };

      if (open) {
        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    }, [open, closeOnEsc, onClose]);

    if (!open) return null;

    return (
      <>
        {showOverlay && (
          <div
            className={drawerOverlayVariants({ variant: overlayVariant })}
            onClick={closeOnOverlayClick ? onClose : undefined}
            data-state={open ? "open" : "closed"}
          />
        )}
        <div
          ref={ref}
          className={cn(drawerVariants({ position, size }), className)}
          data-state={open ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
));

const DrawerTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

Drawer.displayName = "Drawer";
DrawerHeader.displayName = "DrawerHeader";
DrawerFooter.displayName = "DrawerFooter";
DrawerTitle.displayName = "DrawerTitle";
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
