import * as React from "react";
import { cn } from '../../../utils/cn'

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: {
    width?: number | string;
    height?: number | string;
  };
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  resizeHandles?: Array<"n" | "e" | "s" | "w" | "ne" | "se" | "sw" | "nw">;
  grid?: number;
  preserveAspectRatio?: boolean;
  onResize?: (size: { width: number; height: number }) => void;
  onResizeStart?: () => void;
  onResizeEnd?: (size: { width: number; height: number }) => void;
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      children,
      defaultSize = { width: "100%", height: "100%" },
      minWidth = 100,
      maxWidth = Infinity,
      minHeight = 100,
      maxHeight = Infinity,
      resizeHandles = ["e", "s", "se"],
      grid = 1,
      preserveAspectRatio = false,
      className,
      onResize,
      onResizeStart,
      onResizeEnd,
      ...props
    },
    ref
  ) => {
    const [size, setSize] = React.useState({
      width: defaultSize.width,
      height: defaultSize.height,
    });
    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeHandle, setResizeHandle] = React.useState<string | null>(null);
    const initialSize = React.useRef({ width: 0, height: 0 });
    const initialPosition = React.useRef({ x: 0, y: 0 });
    const aspectRatio = React.useRef(1);

    const handleResizeStart = (
      e: React.MouseEvent,
      handle: typeof resizeHandles[number]
    ) => {
      e.preventDefault();
      setIsResizing(true);
      setResizeHandle(handle);
      initialPosition.current = { x: e.clientX, y: e.clientY };
      initialSize.current = {
        width: typeof size.width === "string" ? 0 : size.width,
        height: typeof size.height === "string" ? 0 : size.height,
      };
      aspectRatio.current =
        initialSize.current.width / initialSize.current.height;
      onResizeStart?.();

      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
    };

    const handleResize = React.useCallback(
      (e: MouseEvent) => {
        if (!isResizing || !resizeHandle) return;

        const deltaX = Math.round((e.clientX - initialPosition.current.x) / grid) * grid;
        const deltaY = Math.round((e.clientY - initialPosition.current.y) / grid) * grid;

        let newWidth = initialSize.current.width;
        let newHeight = initialSize.current.height;

        // Update dimensions based on handle
        if (resizeHandle.includes("e")) newWidth += deltaX;
        if (resizeHandle.includes("w")) newWidth -= deltaX;
        if (resizeHandle.includes("s")) newHeight += deltaY;
        if (resizeHandle.includes("n")) newHeight -= deltaY;

        // Apply constraints
        newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
        newHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);

        // Preserve aspect ratio if needed
        if (preserveAspectRatio) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            newHeight = newWidth / aspectRatio.current;
          } else {
            newWidth = newHeight * aspectRatio.current;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        onResize?.({ width: newWidth, height: newHeight });
      },
      [grid, isResizing, maxHeight, maxWidth, minHeight, minWidth, onResize, preserveAspectRatio, resizeHandle]
    );

    const handleResizeEnd = React.useCallback(() => {
      setIsResizing(false);
      setResizeHandle(null);
      onResizeEnd?.(size as { width: number; height: number });
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    }, [onResizeEnd, size, handleResize]);

    const getHandlePosition = (handle: typeof resizeHandles[number]): React.CSSProperties => {
      const styles: React.CSSProperties = {
        position: "absolute",
      };

      switch (handle) {
        case "n":
          styles.top = 0;
          styles.left = "50%";
          styles.transform = "translateX(-50%)";
          styles.cursor = "ns-resize";
          styles.width = "20px";
          styles.height = "4px";
          break;
        case "e":
          styles.top = "50%";
          styles.right = 0;
          styles.transform = "translateY(-50%)";
          styles.cursor = "ew-resize";
          styles.width = "4px";
          styles.height = "20px";
          break;
        case "s":
          styles.bottom = 0;
          styles.left = "50%";
          styles.transform = "translateX(-50%)";
          styles.cursor = "ns-resize";
          styles.width = "20px";
          styles.height = "4px";
          break;
        case "w":
          styles.top = "50%";
          styles.left = 0;
          styles.transform = "translateY(-50%)";
          styles.cursor = "ew-resize";
          styles.width = "4px";
          styles.height = "20px";
          break;
        case "ne":
          styles.top = 0;
          styles.right = 0;
          styles.cursor = "ne-resize";
          styles.width = "8px";
          styles.height = "8px";
          break;
        case "se":
          styles.bottom = 0;
          styles.right = 0;
          styles.cursor = "se-resize";
          styles.width = "8px";
          styles.height = "8px";
          break;
        case "sw":
          styles.bottom = 0;
          styles.left = 0;
          styles.cursor = "sw-resize";
          styles.width = "8px";
          styles.height = "8px";
          break;
        case "nw":
          styles.top = 0;
          styles.left = 0;
          styles.cursor = "nw-resize";
          styles.width = "8px";
          styles.height = "8px";
          break;
      }

      return styles;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          isResizing && "select-none",
          className
        )}
        style={{
          width: size.width,
          height: size.height,
          transition: isResizing ? "none" : "all 0.2s ease",
        }}
        {...props}
      >
        {children}

        {/* Resize Handles */}
        {resizeHandles.map((handle) => (
          <div
            key={handle}
            className={cn(
              "bg-border/50 hover:bg-border",
              isResizing && resizeHandle === handle && "bg-primary"
            )}
            style={getHandlePosition(handle)}
            onMouseDown={(e) => handleResizeStart(e, handle)}
          />
        ))}
      </div>
    );
  }
);

ResizablePanel.displayName = "ResizablePanel";

export { ResizablePanel, type ResizablePanelProps };
