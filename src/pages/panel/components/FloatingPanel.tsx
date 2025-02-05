import * as React from "react";
import { cn } from '../../../utils/cn'
import { FaGrip } from "react-icons/fa6";
import { BiX } from "react-icons/bi";


interface FloatingPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  resizable?: boolean;
  draggable?: boolean;
  onClose?: () => void;
  snapPoints?: Array<{ x: number; y: number }>;
  snapThreshold?: number;
}

const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(
  (
    {
      children,
      title,
      defaultPosition = { x: 100, y: 100 },
      minWidth = 200,
      maxWidth = 800,
      minHeight = 100,
      maxHeight = 600,
      resizable = true,
      draggable = true,
      className,
      onClose,
      snapPoints = [],
      snapThreshold = 20,
      ...props
    },
    ref
  ) => {
    const [position, setPosition] = React.useState(defaultPosition);
    const [isDragging, setIsDragging] = React.useState(false);
    const [size, setSize] = React.useState({ width: 300, height: 200 });
    const [isResizing, setIsResizing] = React.useState(false);
    
    const dragStart = React.useRef({ x: 0, y: 0 });
    const panelRef = React.useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!draggable) return;
      
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;

        let newX = e.clientX - dragStart.current.x;
        let newY = e.clientY - dragStart.current.y;

        // Check snap points
        snapPoints.forEach((point) => {
          if (Math.abs(newX - point.x) < snapThreshold) {
            newX = point.x;
          }
          if (Math.abs(newY - point.y) < snapThreshold) {
            newY = point.y;
          }
        });

        // Keep panel within viewport
        const panel = panelRef.current;
        if (panel) {
          newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
          newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));
        }

        setPosition({ x: newX, y: newY });
      },
      [isDragging, snapPoints, snapThreshold]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);

    const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
      if (!resizable) return;
      
      e.stopPropagation();
      setIsResizing(true);
      
      const startSize = { ...size };
      const startPos = { x: e.clientX, y: e.clientY };

      const handleResizeMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        let newWidth = startSize.width;
        let newHeight = startSize.height;

        if (direction.includes("e")) newWidth += deltaX;
        if (direction.includes("s")) newHeight += deltaY;
        if (direction.includes("w")) {
          newWidth -= deltaX;
          setPosition(prev => ({ ...prev, x: prev.x + deltaX }));
        }
        if (direction.includes("n")) {
          newHeight -= deltaY;
          setPosition(prev => ({ ...prev, y: prev.y + deltaY }));
        }

        setSize({
          width: Math.min(Math.max(newWidth, minWidth), maxWidth),
          height: Math.min(Math.max(newHeight, minHeight), maxHeight),
        });
      };

      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleResizeMove);
      });
    };

    return (
      <div
        ref={panelRef}
        className={cn(
          "fixed z-50 rounded-lg border bg-background shadow-lg",
          isDragging && "pointer-events-none select-none",
          className
        )}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
        {...props}
      >
        {/* Header */}
        <div
          className="flex h-10 items-center justify-between border-b px-4"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            {draggable && <FaGrip className="h-4 w-4 cursor-move text-muted-foreground" />}
            <div className="text-sm font-medium">{title}</div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <BiX className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="h-[calc(100%-2.5rem)] overflow-auto p-4">{children}</div>

        {/* Resize Handles */}
        {resizable && (
          <>
            <div
              className="absolute right-0 top-0 h-full w-1 cursor-ew-resize hover:bg-border/50"
              onMouseDown={(e) => handleResizeMouseDown(e, "e")}
            />
            <div
              className="absolute bottom-0 left-0 h-1 w-full cursor-ns-resize hover:bg-border/50"
              onMouseDown={(e) => handleResizeMouseDown(e, "s")}
            />
            <div
              className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "se")}
            />
          </>
        )}
      </div>
    );
  }
);

FloatingPanel.displayName = "FloatingPanel";

export { FloatingPanel, type FloatingPanelProps };
