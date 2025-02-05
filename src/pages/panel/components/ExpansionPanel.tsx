import * as React from "react";
import { cn } from '../../../utils/cn'
import { BiChevronDown } from "react-icons/bi";

interface ExpansionPanelItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (expanded: boolean) => void;
}

interface ExpansionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<ExpansionPanelItemProps> | React.ReactElement<ExpansionPanelItemProps>[];
  multiple?: boolean;
  defaultExpandedItems?: number[];
  onChange?: (expandedItems: number[]) => void;
}

const ExpansionPanelItem = React.forwardRef<HTMLDivElement, ExpansionPanelItemProps>(
  ({ title, children, defaultExpanded = false, disabled = false, className, onChange }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    const handleToggle = () => {
      if (disabled) return;
      setIsExpanded(!isExpanded);
      onChange?.(!isExpanded);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border border-border",
          disabled && "opacity-50",
          className
        )}
      >
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors",
            disabled ? "cursor-not-allowed" : "hover:bg-muted/50"
          )}
          onClick={handleToggle}
          disabled={disabled}
        >
          {title}
          <BiChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  }
);

ExpansionPanelItem.displayName = "ExpansionPanelItem";

const ExpansionPanel = React.forwardRef<HTMLDivElement, ExpansionPanelProps>(
  (
    {
      children,
      multiple = false,
      defaultExpandedItems = [],
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = React.useState<number[]>(defaultExpandedItems);

    const handleItemChange = (index: number, expanded: boolean) => {
      let newExpandedItems: number[];

      if (multiple) {
        newExpandedItems = expanded
          ? [...expandedItems, index]
          : expandedItems.filter((item) => item !== index);
      } else {
        newExpandedItems = expanded ? [index] : [];
      }

      setExpandedItems(newExpandedItems);
      onChange?.(newExpandedItems);
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-2", className)}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement(child, {
            defaultExpanded: expandedItems.includes(index),
            onChange: (expanded: boolean) => {
              handleItemChange(index, expanded);
              child.props.onChange?.(expanded);
            },
          });
        })}
      </div>
    );
  }
);

ExpansionPanel.displayName = "ExpansionPanel";

export {
  ExpansionPanel,
  ExpansionPanelItem,
  type ExpansionPanelProps,
  type ExpansionPanelItemProps,
};
