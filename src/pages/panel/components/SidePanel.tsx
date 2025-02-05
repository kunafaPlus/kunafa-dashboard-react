import * as React from "react";
import { cn } from '../../../utils/cn'
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";


interface SidePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "left" | "right";
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  defaultCollapsed?: boolean;
  autoCollapse?: boolean;
  collapsedWidth?: number;
  showToggle?: boolean;
  onWidthChange?: (width: number) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SidePanel = React.forwardRef<HTMLDivElement, SidePanelProps>(
  (
    {
      children,
      position = "left",
      defaultWidth = 300,
      minWidth = 200,
      maxWidth = 600,
      defaultCollapsed = false,
      autoCollapse = false,
      collapsedWidth = 64,
      showToggle = true,
      className,
      onWidthChange,
      onCollapsedChange,
      ...props
    },
    ref
  ) => {
    const [width, setWidth] = React.useState(defaultWidth);
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartX = React.useRef<number>(0);
    const dragStartWidth = React.useRef<number>(0);

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = width;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;

        const delta = position === "left"
          ? e.clientX - dragStartX.current
          : dragStartX.current - e.clientX;
        
        const newWidth = Math.min(
          Math.max(dragStartWidth.current + delta, minWidth),
          maxWidth
        );
        
        setWidth(newWidth);
        onWidthChange?.(newWidth);
      },
      [isDragging, maxWidth, minWidth, onWidthChange, position]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
      onCollapsedChange?.(!isCollapsed);
    };

    React.useEffect(() => {
      if (autoCollapse) {
        const handleResize = () => {
          if (window.innerWidth < 768 && !isCollapsed) {
            setIsCollapsed(true);
            onCollapsedChange?.(true);
          }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }
    }, [autoCollapse, isCollapsed, onCollapsedChange]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-full flex-col bg-background",
          position === "left" ? "border-r" : "border-l",
          isDragging && "select-none",
          className
        )}
        style={{
          width: isCollapsed ? collapsedWidth : width,
          minWidth: isCollapsed ? collapsedWidth : minWidth,
          maxWidth: isCollapsed ? collapsedWidth : maxWidth,
          transition: isDragging ? "none" : "width 0.3s ease-in-out",
        }}
        {...props}
      >
        {children}
        
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            className={cn(
              "absolute top-0 z-10 h-full w-1 cursor-ew-resize hover:bg-border/50",
              position === "left" ? "right-0" : "left-0"
            )}
            onMouseDown={handleMouseDown}
          />
        )}

        {/* Toggle Button */}
        {showToggle && (
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "absolute top-4 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
              position === "left"
                ? "right-0 translate-x-1/2"
                : "left-0 -translate-x-1/2"
            )}
          >
            {position === "left" ? (
              isCollapsed ? (
                <BiChevronRight className="h-4 w-4" />
              ) : (
                <BiChevronLeft className="h-4 w-4" />
              )
            ) : isCollapsed ? (
              <BsChevronLeft className="h-4 w-4" />
            ) : (
              <BsChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);

SidePanel.displayName = "SidePanel";

export { SidePanel, type SidePanelProps };
