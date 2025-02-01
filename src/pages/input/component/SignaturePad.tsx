import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { Point, SignaturePadProps } from "../utils/type";

export const signaturePadVariants = cva(
  "relative border rounded-md overflow-hidden touch-none",
  {
    variants: {
      variant: {
        default: "border-input",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "min-h-[100px]",
        md: "min-h-[150px]",
        lg: "min-h-[200px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);


const SignaturePad = React.forwardRef<HTMLDivElement, SignaturePadProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      onBegin,
      onEnd,
      width = 600,
      height = 200,
      penColor = "#000000",
      backgroundColor = "#ffffff",
      minWidth = 0.5,
      maxWidth = 2.5,
      velocityFilterWeight = 0.7,
      error,
      label,
      hint,
      disabled,
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [lastPoint, setLastPoint] = React.useState<Point | null>(null);
    const [lastVelocity, setLastVelocity] = React.useState(0);
    const [lastWidth, setLastWidth] = React.useState(0);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const clear = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onChange?.({ target: { value: "" } } as any); // Call onChange with an empty string
    };

    const toDataURL = () => {
      return canvasRef.current?.toDataURL() || "";
    };

    const fromDataURL = (dataUrl: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
      image.src = dataUrl;
    };

    React.useEffect(() => {
      if (value) {
        fromDataURL(value);
      } else {
        clear();
      }
    }, [value]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = penColor;
      ctx.lineWidth = minWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }, [width, height, backgroundColor, penColor, minWidth]);

    const getPointFromEvent = (
      e: MouseEvent | TouchEvent
    ): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      let x: number, y: number, pressure: number;

      if (window.TouchEvent && e instanceof TouchEvent) {
        if (e.touches.length === 0) return null;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
        pressure = touch.force || 0.5;
      } else if (e instanceof MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        pressure = 0.5;
      } else {
        return null;
      }

      return { x, y, pressure };
    };

    const drawPoint = (point: Point, width: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y);
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.closePath();
    };

    const drawCurve = (
      startPoint: Point,
      endPoint: Point,
      width: number
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.closePath();
    };

    const getVelocity = (startPoint: Point, endPoint: Point): number => {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getWidth = (velocity: number, pressure: number): number => {
      const newVelocity =
        velocityFilterWeight * velocity +
        (1 - velocityFilterWeight) * lastVelocity;

      const width = Math.max(
        maxWidth / (1 + newVelocity),
        minWidth
      );

      return width * pressure;
    };

    const handlePointerStart = (e: React.PointerEvent) => {
      if (disabled) return;

      const point = getPointFromEvent(e.nativeEvent);
      if (!point) return;

      setIsDrawing(true);
      setLastPoint(point);
      setLastVelocity(0);
      setLastWidth(getWidth(0, point.pressure));

      drawPoint(point, lastWidth);
      onBegin?.();
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDrawing || disabled) return;

      const point = getPointFromEvent(e.nativeEvent);
      if (!point || !lastPoint) return;

      const velocity = getVelocity(lastPoint, point);
      const width = getWidth(velocity, point.pressure);

      drawCurve(lastPoint, point, width);

      setLastPoint(point);
      setLastVelocity(velocity);
      setLastWidth(width);
    };

    const handlePointerEnd = () => {
      if (!isDrawing) return;

      setIsDrawing(false);
      onChange?.({ target: { value: toDataURL() } } as any); // Call onChange with the correct structure
      onEnd?.();
    };

    return (
      <div ref={containerRef} className={cn("w-full", className)}>
        {label&&<p>{label}</p>}
        <div
          className={cn(
            signaturePadVariants({ variant, size }as{}),
            disabled && "opacity-50 cursor-not-allowed"
          )}
          {...props}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onPointerDown={handlePointerStart}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerOut={handlePointerEnd}
            style={{
              touchAction: "none",
            }}
          />

          {!disabled && (
            <button
              type="button"
              className="absolute bottom-2 right-2 p-2 bg-background/80 hover:bg-background rounded-md text-sm"
              onClick={clear}
            >
              Clear
            </button>
          )}
        </div>

        {(error || hint) && (
          <div
            className={cn(
              "mt-1 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";

export { SignaturePad };