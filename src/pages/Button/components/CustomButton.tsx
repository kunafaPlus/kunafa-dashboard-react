import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "../../../utils/cn";
import { Link } from 'react-router-dom';

const buttonVariants = cva(
  "flex items-center min-h-[40px] justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        outline: "bg-transparent border hover:bg-gray-50",
        icon: "bg-transparent border hover:bg-gray-50 rounded-full",
        secondary: "bg-[#F5F7FA] border hover:bg-gray-50",
        ghost: "bg-transparent hover:bg-gray-50",
        link: 'bg-transparent underline-offset-4 hover:underline text-primary',
        white: 'bg-white text-text-secondary hover:bg-primary/90',
        default: 'bg-primary text-icon-light hover:bg-primary/90',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'bg-blue-500 text-white hover:bg-blue-600',
      },
      size: {
        sm: "text-sm py-1.5 px-3",
        default: "text-base py-2 px-4",
        lg: "text-lg py-2.5 px-5",
        icon: "text-sm py-2 px-2",
        xl: "text-xl py-3 px-6",
        compact: "text-base py-1.5 px-3",
      },
      iconSize: {
        sm: "[&_svg]:w-4 [&_svg]:h-4",
        default: "[&_svg]:w-6 [&_svg]:h-6",
        lg: "[&_svg]:w-8 [&_svg]:h-8",
        xl: "[&_svg]:w-10 [&_svg]:h-10",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      iconSize: "default",
      fullWidth: false,
      rounded: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string | ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  selected?: boolean;
  href?: string;
}

const CustomButton: FC<ButtonProps> = ({
  className,
  children,
  variant,
  size,
  iconSize,
  fullWidth,
  rounded,
  label,
  icon,
  iconPosition = 'left',
  onClick,
  type = "button",
  disabled = false,
  selected,
  href,
  ...props
}) => {
  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && <span className={cn(variant === 'icon' && 'ml-0')}>{icon}</span>}
      {label || children}
      {icon && iconPosition === 'right' && <span className={cn(variant === 'icon' && 'mr-0')}>{icon}</span>}
    </>
  );

  const buttonClasses = cn(
    buttonVariants({ variant, size, iconSize, fullWidth, rounded }),
    {
      'bg-primary/10': selected,
    },
    className
  );

  if (href) {
    return (
      <Link to={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
            {buttonContent}
    </button>
  );
};

export default CustomButton;