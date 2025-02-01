import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const segmentedButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "[&>*]:bg-primary [&>*]:text-white [&>*:hover]:bg-primary/90 [&>*.selected]:bg-primary/80",
        destructive:
          "[&>*]:bg-destructive [&>*]:text-destructive-foreground [&>*:hover]:bg-destructive/90 [&>*.selected]:bg-destructive/80",
        outline:
          "[&>*]:border [&>*]:border-input [&>*]:bg-background [&>*:hover]:bg-accent [&>*:hover]:text-accent-foreground [&>*.selected]:bg-accent [&>*.selected]:text-accent-foreground",
        secondary:
          "[&>*]:bg-secondary [&>*]:text-secondary-foreground [&>*:hover]:bg-secondary/80 [&>*.selected]:bg-secondary/70",
        ghost:
          "[&>*:hover]:bg-accent [&>*:hover]:text-accent-foreground [&>*.selected]:bg-accent [&>*.selected]:text-accent-foreground",
        link: "[&>*]:text-primary [&>*]:underline-offset-4 [&>*:hover]:underline [&>*.selected]:underline",
      },
      size: {
        default: "[&>*]:h-9 [&>*]:px-4 [&>*]:py-2",
        sm: "[&>*]:h-8 [&>*]:px-3 [&>*]:text-xs",
        lg: "[&>*]:h-10 [&>*]:px-8",
        icon: "[&>*]:h-9 [&>*]:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SegmentOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SegmentedButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof segmentedButtonVariants> {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  fullWidth?: boolean;
  showIcons?: boolean;
  allowDeselect?: boolean;
  onChange?: (value: string) => void;
}

const SegmentedButton = React.forwardRef<HTMLDivElement, SegmentedButtonProps>(
  (
    {
      className,
      variant,
      size,
      options,
      value: controlledValue,
      defaultValue,
      fullWidth = false,
      showIcons = true,
      allowDeselect = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
      controlledValue || defaultValue
    );

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setSelectedValue(controlledValue);
      }
    }, [controlledValue]);

    const handleClick = (optionValue: string) => {
      if (allowDeselect && optionValue === selectedValue) {
        setSelectedValue(undefined);
        onChange?.(undefined as unknown as string);
      } else {
        setSelectedValue(optionValue);
        onChange?.(optionValue);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          segmentedButtonVariants({ variant, size }),
          "[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap",
              selectedValue === option.value && "selected",
              option.disabled && "pointer-events-none opacity-50"
            )}
            onClick={() => !option.disabled && handleClick(option.value)}
            disabled={option.disabled}
          >
            {showIcons && option.icon}
            {option.label}
          </button>
        ))}
      </div>
    );
  }
);

SegmentedButton.displayName = "SegmentedButton";

export { SegmentedButton };
