import * as React from "react";
import { cn } from "../../utils/cn";
import { CommandItemProps, CommandProps } from "./types";
import { commandInputVariants, commandVariants } from "./variants";


const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      className,
      children,
      size,
      value,
      onValueChange,
      placeholder,
      filter = (value, search) =>
        value.toLowerCase().includes(search.toLowerCase()),
      ...props
    },
    ref
  ) => {
    const [search, setSearch] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const itemsRef = React.useRef<HTMLDivElement[]>([]);

    const filteredChildren = React.Children.toArray(children).filter((child) => {
      if (React.isValidElement(child) && "value" in child.props) {
        return filter(child.props.value as string, search);
      }
      return false;
    });

    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev < filteredChildren.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredChildren.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (activeIndex >= 0 && activeIndex < filteredChildren.length) {
            const child = filteredChildren[activeIndex];
            if (React.isValidElement(child) && child.props.onSelect) {
              child.props.onSelect();
            }
          }
          break;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(commandVariants({ size }), className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <input
          className={cn(commandInputVariants({ variant: "bottomBorder" }))}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onValueChange?.(e.target.value);
          }}
          placeholder={placeholder}
        />
        <div className="overflow-y-auto p-1">
          {React.Children.map(filteredChildren, (child, index) => {
            if (!React.isValidElement(child)) return null;

            return React.cloneElement(child as React.ReactElement<CommandItemProps>, {
              ref: (el: HTMLDivElement) => (itemsRef.current[index] = el),
              "data-active": activeIndex === index,
              className: cn(
                child.props.className,
                activeIndex === index && "bg-accent text-accent-foreground"
              ),
            });
          })}
        </div>
      </div>
    );
  }
);

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, children, onSelect, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="option"
        className={cn(
          "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground",
          className
        )}
        onClick={onSelect}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Command.displayName = "Command";
CommandItem.displayName = "CommandItem";

export { Command, CommandItem, commandVariants, commandInputVariants };
