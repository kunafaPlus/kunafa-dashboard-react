import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { PopoverProps } from "./types";
import { popoverVariants } from "./variants";





const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      className,
      children,
      trigger,
      variant,
      placement,
      content,
      size,
      open: controlledOpen,
      onOpenChange,
      side = "bottom",
      align = "center",
      modal = false,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    const isOpen = controlledOpen ?? uncontrolledOpen;
    const setIsOpen = onOpenChange ?? setUncontrolledOpen;

    const updatePosition = React.useCallback(() => {
      if (!triggerRef.current || !popoverRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (side) {
        case "top":
          top = triggerRect.top - popoverRect.height - 8;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          break;
        case "left":
          left = triggerRect.left - popoverRect.width - 8;
          top = triggerRect.top;
          break;
        case "right":
          left = triggerRect.right + 8;
          top = triggerRect.top;
          break;
      }

      switch (align) {
        case "start":
          left = side === "left" || side === "right" 
            ? left 
            : triggerRect.left;
          break;
        case "center":
          left = side === "left" || side === "right"
            ? left
            : triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case "end":
          left = side === "left" || side === "right"
            ? left
            : triggerRect.right - popoverRect.width;
          break;
      }

      setPosition({ top, left });
    }, [side, align]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          !modal &&
          isOpen &&
          !triggerRef.current?.contains(event.target as Node) &&
          !popoverRef.current?.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (!modal && isOpen && event.key === "Escape") {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        updatePosition();
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, modal, setIsOpen, updatePosition]);

    return (
      <>
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-block"
        >
          {trigger}
        </div>
        {isOpen && (
          <div
            ref={mergeRefs(ref, popoverRef)}
            className={cn(popoverVariants({ variant, size }), className)}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
            }}
            data-state={isOpen ? "open" : "closed"}
            data-side={side}
            {...props}
          >
            {children}
          </div>
        )}
      </>
    );
  }
);

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

Popover.displayName = "Popover";

export { Popover, popoverVariants };
