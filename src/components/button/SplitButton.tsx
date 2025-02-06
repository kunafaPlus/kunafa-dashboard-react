import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, splitButtonVariants } from "./variants";
import { SplitButtonProps } from "./types";
import { Popover } from "../../pages/misc/components/Popover";
import { BiChevronDown } from "react-icons/bi";

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      options = [],
      onOptionSelect,
      onMainClick,
      mainLabel,
      mainIcon,
      placement = "bottom-start",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOptionClick = (value: string) => {
      onOptionSelect?.(value);
      setIsOpen(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          splitButtonVariants({ isOpen }),
          className
        )}
        // {...props}
      >
        <button
          type="button"
          onClick={onMainClick}
          className={cn(
            buttonVariants({ variant, size }),
            "rounded-r-none"
          )}
        >
          {mainIcon && <span className="mr-2">{mainIcon}</span>}
          {mainLabel}
        </button>
        <Popover
          open={isOpen}
          onOpenChange={setIsOpen}
          placement={placement}
          content={
            <div className="w-48 rounded-md border bg-popover p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={cn(
                    "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {option.icon && (
                    <span className="mr-2">{option.icon}</span>
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          }
        >
          <button
            type="button"
            className={cn(
              buttonVariants({ variant, size }),
              "rounded-l-none border-l",
              "px-2"
            )}
          >
            <BiChevronDown className="h-4 w-4" />
          </button>
        </Popover>
      </div>
    );
  }
);

SplitButton.displayName = "SplitButton";

export { SplitButton };
export default SplitButton;