import * as React from "react";
import { cn } from '../../../utils/cn'
import { BiChevronDown } from "react-icons/bi";

interface GroupPanelProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  badge?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  variant?: "default" | "bordered";
  size?: "sm" | "md" | "lg";
  onCollapseChange?: (collapsed: boolean) => void;
}

const GroupPanel = React.forwardRef<HTMLFieldSetElement, GroupPanelProps>(
  (
    {
      children,
      title,
      description,
      collapsible = false,
      defaultCollapsed = false,
      badge,
      className,
      headerClassName,
      contentClassName,
      variant = "default",
      size = "md",
      onCollapseChange,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const handleToggle = () => {
      if (!collapsible) return;
      setIsCollapsed(!isCollapsed);
      onCollapseChange?.(!isCollapsed);
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "p-3 text-sm";
        case "lg":
          return "p-6 text-lg";
        default:
          return "p-4";
      }
    };

    return (
      <fieldset
        ref={ref}
        className={cn(
          "rounded-lg",
          variant === "bordered" && "border",
          getSizeClasses(),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between gap-4",
            collapsible && "cursor-pointer",
            headerClassName
          )}
          onClick={handleToggle}
        >
          <div className="space-y-1">
            {title && (
              <legend
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                )}
              >
                {title}
              </legend>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {badge && (
              <div className="rounded-md bg-muted px-2 py-1 text-sm">
                {badge}
              </div>
            )}
            {collapsible && (
              <BiChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isCollapsed && "-rotate-90"
                )}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
            isCollapsed
              ? "grid-rows-[0fr] opacity-0"
              : "grid-rows-[1fr] opacity-100",
            contentClassName
          )}
        >
          <div className="overflow-hidden">
            <div className={cn("pt-4")}>{children}</div>
          </div>
        </div>
      </fieldset>
    );
  }
);

GroupPanel.displayName = "GroupPanel";

export { GroupPanel, type GroupPanelProps };
