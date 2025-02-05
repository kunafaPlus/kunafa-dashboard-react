import * as React from "react";
import { cn } from '../../../utils/cn'
import { BiX } from "react-icons/bi";


type DockPosition = "left" | "right" | "top" | "bottom";

interface DockPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultPosition?: DockPosition;
  defaultDocked?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  onPositionChange?: (position: DockPosition) => void;
  onDockedChange?: (docked: boolean) => void;
  showClose?: boolean;
  onClose?: () => void;
}

const DockPanel = React.forwardRef<HTMLDivElement, DockPanelProps>(
  (
    {
      children,
      defaultPosition = "right",
      defaultDocked = true,
      minWidth = 200,
      maxWidth = 600,
      minHeight = 100,
      maxHeight = 600,
      className,
      onPositionChange,
      onDockedChange,
      showClose = false,
      onClose,
      ...props
    },
    ref
  ) => {
    const [position, setPosition] = React.useState<DockPosition>(defaultPosition);
    const [isDocked, setIsDocked] = React.useState(defaultDocked);
    const [size, setSize] = React.useState({
      width: minWidth,
      height: minHeight,
    });
    const [isDragging, setIsDragging] = React.useState(false);

    const isHorizontal = position === "left" || position === "right";
    const dragStart = React.useRef({ x: 0, y: 0, size: size });

    const handleDragStart = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        size: { ...size },
      };
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    };

    const handleDragMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;

        let newSize;
        if (isHorizontal) {
          const delta =
            position === "right"
              ? dragStart.current.x - e.clientX
              : e.clientX - dragStart.current.x;
          newSize = {
            width: Math.min(
              Math.max(dragStart.current.size.width + delta, minWidth),
              maxWidth
            ),
            height: size.height,
          };
        } else {
          const delta =
            position === "bottom"
              ? dragStart.current.y - e.clientY
              : e.clientY - dragStart.current.y;
          newSize = {
            width: size.width,
            height: Math.min(
              Math.max(dragStart.current.size.height + delta, minHeight),
              maxHeight
            ),
          };
        }
        setSize(newSize);
      },
      [isDragging, isHorizontal, maxHeight, maxWidth, minHeight, minWidth, position, size.height, size.width]
    );

    const handleDragEnd = React.useCallback(() => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    }, [handleDragMove]);

    const handlePositionChange = (newPosition: DockPosition) => {
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    };

    const toggleDocked = () => {
      setIsDocked(!isDocked);
      onDockedChange?.(!isDocked);
    };

    const getPositionStyles = (): React.CSSProperties => {
      const styles: React.CSSProperties = {
        position: "fixed",
        transition: isDragging ? "none" : "all 0.3s ease-in-out",
      };

      switch (position) {
        case "left":
          styles.left = isDocked ? 0 : -size.width;
          styles.top = 0;
          styles.bottom = 0;
          styles.width = size.width;
          break;
        case "right":
          styles.right = isDocked ? 0 : -size.width;
          styles.top = 0;
          styles.bottom = 0;
          styles.width = size.width;
          break;
        case "top":
          styles.top = isDocked ? 0 : -size.height;
          styles.left = 0;
          styles.right = 0;
          styles.height = size.height;
          break;
        case "bottom":
          styles.bottom = isDocked ? 0 : -size.height;
          styles.left = 0;
          styles.right = 0;
          styles.height = size.height;
          break;
      }

      return styles;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "z-50 flex bg-background shadow-lg",
          isDragging && "select-none",
          className
        )}
        style={getPositionStyles()}
        {...props}
      >
        {/* Resize Handle */}
        <div
          className={cn(
            "absolute z-10 bg-transparent transition-colors hover:bg-border/50",
            isHorizontal
              ? "h-full w-1 cursor-ew-resize"
              : "h-1 w-full cursor-ns-resize",
            position === "left" && "right-0",
            position === "right" && "left-0",
            position === "top" && "bottom-0",
            position === "bottom" && "top-0"
          )}
          onMouseDown={handleDragStart}
        />

        {/* Content */}
        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <div className="flex h-10 items-center justify-between border-b px-4">
            <div className="flex gap-2">
              <select
                value={position}
                onChange={(e) => handlePositionChange(e.target.value as DockPosition)}
                className="h-6 rounded-md border-none bg-transparent text-sm"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
              <button
                type="button"
                onClick={toggleDocked}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isDocked ? "Undock" : "Dock"}
              </button>
            </div>
            {showClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <BiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    );
  }
);

DockPanel.displayName = "DockPanel";

export { DockPanel, type DockPanelProps, type DockPosition };
