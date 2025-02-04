import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const statusButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white shadow hover:bg-primary/90',
        success: 'bg-green-600 text-white shadow hover:bg-green-700',
        warning: 'bg-yellow-600 text-white shadow hover:bg-yellow-700',
        error: 'bg-red-600 text-white shadow hover:bg-red-700',
        info: 'bg-blue-600 text-white shadow hover:bg-blue-700',
        pending: 'bg-orange-600 text-white shadow hover:bg-orange-700',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type Status = 'idle' | 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusConfig {
  icon?: React.ReactNode;
  text?: string;
  variant?: VariantProps<typeof statusButtonVariants>['variant'];
}

interface StatusButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof statusButtonVariants>, 'variant'> {
  status?: Status;
  statuses?: Partial<Record<Status, StatusConfig>>;
  showIcon?: boolean;
  iconPlacement?: 'start' | 'end';
  iconClassName?: string;
  statusClassName?: string;
  pulseOnChange?: boolean;
}

const defaultStatuses: Record<Status, StatusConfig> = {
  idle: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
      </svg>
    ),
    variant: 'default',
  },
  success: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    ),
    variant: 'success',
  },
  warning: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    variant: 'warning',
  },
  error: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    ),
    variant: 'error',
  },
  info: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    variant: 'info',
  },
  pending: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 animate-spin"
      >
        <path
          fillRule="evenodd"
          d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
          clipRule="evenodd"
        />
      </svg>
    ),
    variant: 'pending',
  },
};

const StatusButton = React.forwardRef<HTMLButtonElement, StatusButtonProps>(
  (
    {
      className,
      size,
      status = 'idle',
      statuses = {},
      showIcon = true,
      iconPlacement = 'start',
      iconClassName,
      statusClassName,
      pulseOnChange = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isPulsing, setIsPulsing] = React.useState(false);
    const prevStatus = React.useRef(status);

    // Merge default and custom statuses
    const mergedStatuses = React.useMemo(
      () => ({
        ...defaultStatuses,
        ...statuses,
      }),
      [statuses]
    );

    const currentStatus = mergedStatuses[status];

    React.useEffect(() => {
      if (pulseOnChange && status !== prevStatus.current) {
        setIsPulsing(true);
        const timer = setTimeout(() => { setIsPulsing(false); }, 1000);
        prevStatus.current = status;
        return () => { clearTimeout(timer); };
      }
    }, [status, pulseOnChange]);

    return (
      <button
        ref={ref}
        className={cn(
          statusButtonVariants({
            variant: currentStatus.variant,
            size,
          }),
          isPulsing && 'animate-pulse',
          statusClassName,
          className
        )}
        {...props}
      >
        {showIcon && iconPlacement === 'start' && currentStatus.icon && (
          <span className={cn('mr-2', iconClassName)}>{currentStatus.icon}</span>
        )}

        <span>{currentStatus.text || children}</span>

        {showIcon && iconPlacement === 'end' && currentStatus.icon && (
          <span className={cn('ml-2', iconClassName)}>{currentStatus.icon}</span>
        )}
      </button>
    );
  }
);

StatusButton.displayName = 'StatusButton';

export { StatusButton, type Status, type StatusConfig };
