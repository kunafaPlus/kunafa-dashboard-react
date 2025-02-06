import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { buttonVariants } from './variants';



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