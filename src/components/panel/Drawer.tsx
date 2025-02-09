import * as React from "react";
import { cn } from '../../utils/cn'
import { DrawerProps } from "./types";
import { drawerOverlayVariants, drawerVariants } from "./variants";





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
