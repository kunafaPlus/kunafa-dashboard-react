import * as React from "react";
import { cn } from "../../utils/cn";
import { baseButtonVariants, switchButtonVariants } from "./variants/index";
import { SwitchButtonProps } from "./types";

const SwitchButton = React.forwardRef<HTMLButtonElement, SwitchButtonProps>(
  (
    {
      className,
      variant = "outline",
      size = "default",
      checked = false,
      thumbColor,
      onCheckedChange,
      trackColor,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      onCheckedChange?.(!checked);
    };

    const style = {
      ...(thumbColor && {
        "--switch-thumb-color": thumbColor,
      }),
      ...(trackColor && {
        "--switch-track-color": trackColor,
      }),
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        type="button"
        onClick={handleClick}
        className={cn(
          baseButtonVariants({ variant, size }as any),
          switchButtonVariants({ size } as any),
          "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked
            ? "bg-[var(--switch-track-color,primary)] dark:bg-[var(--switch-track-color,primary)]"
            : "bg-input",
          className
        )}
        style={style}
        // {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block transform rounded-full bg-[var(--switch-thumb-color,background)] shadow-lg ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-full" : "translate-x-0"
          )}
        />
        {children}
      </button>
    );
  }
);

SwitchButton.displayName = "SwitchButton";

export { SwitchButton };
