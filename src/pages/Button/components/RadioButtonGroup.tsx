import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const radioButtonGroupVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          '[&>*]:bg-primary [&>*]:text-white [&>*:hover]:bg-primary/90 [&>*.selected]:bg-primary/80',
        destructive:
          '[&>*]:bg-destructive [&>*]:text-destructive-foreground [&>*:hover]:bg-destructive/90 [&>*.selected]:bg-destructive/80',
        outline:
          '[&>*]:border [&>*]:border-input [&>*]:bg-background [&>*:hover]:bg-accent [&>*:hover]:text-accent-foreground [&>*.selected]:bg-accent [&>*.selected]:text-accent-foreground',
        secondary:
          '[&>*]:bg-secondary [&>*]:text-secondary-foreground [&>*:hover]:bg-secondary/80 [&>*.selected]:bg-secondary/70',
        ghost:
          '[&>*:hover]:bg-accent [&>*:hover]:text-accent-foreground [&>*.selected]:bg-accent [&>*.selected]:text-accent-foreground',
        link: '[&>*]:text-primary [&>*]:underline-offset-4 [&>*:hover]:underline [&>*.selected]:underline',
      },
      orientation: {
        horizontal: 'flex-row [&>*:not(:first-child)]:-ml-px',
        vertical: 'flex-col [&>*:not(:first-child)]:-mt-px',
      },
      size: {
        default: '[&>*]:h-9 [&>*]:px-4 [&>*]:py-2',
        sm: '[&>*]:h-8 [&>*]:px-3 [&>*]:text-xs',
        lg: '[&>*]:h-10 [&>*]:px-8',
        icon: '[&>*]:h-9 [&>*]:w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
      size: 'default',
    },
  }
);

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  description?: React.ReactNode;
}

interface RadioButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof radioButtonGroupVariants> {
  options: RadioOption[];
  name: string;
  value?: string;
  defaultValue?: string;
  fullWidth?: boolean;
  showIcons?: boolean;
  showDescription?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
}

const RadioButtonGroup = React.forwardRef<HTMLDivElement, RadioButtonGroupProps>(
  (
    {
      className,
      variant,
      orientation,
      size,
      options,
      name,
      value: controlledValue,
      defaultValue,
      fullWidth = false,
      showIcons = true,
      showDescription = false,
      required = false,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        className={cn(
          radioButtonGroupVariants({ variant, orientation, size }),
          orientation === 'horizontal'
            ? '[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none'
            : '[&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none',
          fullWidth && 'w-full',
          className
        )}
        role="radiogroup"
        {...props}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'relative inline-flex cursor-pointer items-center gap-2 whitespace-nowrap',
              selectedValue === option.value && 'selected',
              option.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              disabled={option.disabled}
              required={required}
              onChange={handleChange}
            />
            {showIcons && option.icon}
            <div className="flex flex-col">
              <span>{option.label}</span>
              {showDescription && option.description && (
                <span className="text-xs text-muted-foreground">{option.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
    );
  }
);

RadioButtonGroup.displayName = 'RadioButtonGroup';

export { RadioButtonGroup };
