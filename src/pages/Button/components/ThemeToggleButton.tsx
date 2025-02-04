import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const themeToggleButtonVariants = cva(
  'group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      animation: {
        none: '',
        fade: 'transition-opacity duration-200',
        rotate: 'transition-transform duration-200 group-hover:rotate-180',
        scale: 'transition-transform duration-200 group-hover:scale-110',
        bounce: 'animate-bounce',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'rotate',
    },
  }
);

interface ThemeToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof themeToggleButtonVariants> {
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  lightIcon?: React.ReactNode;
  darkIcon?: React.ReactNode;
  systemIcon?: React.ReactNode;
  showLabel?: boolean;
  labelFormat?: 'capitalize' | 'lowercase' | 'uppercase';
  persist?: boolean;
  storageKey?: string;
}

const ThemeToggleButton = React.forwardRef<HTMLButtonElement, ThemeToggleButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      theme: initialTheme = 'system',
      onThemeChange,
      lightIcon,
      darkIcon,
      systemIcon,
      showLabel = false,
      labelFormat = 'capitalize',
      persist = true,
      storageKey = 'theme',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(initialTheme);

    React.useEffect(() => {
      if (persist) {
        const savedTheme = localStorage.getItem(storageKey) as 'light' | 'dark' | 'system' | null;
        if (savedTheme) {
          setTheme(savedTheme);
          applyTheme(savedTheme);
        }
      }
    }, [persist, storageKey]);

    const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(newTheme);
      }

      if (persist) {
        localStorage.setItem(storageKey, newTheme);
      }

      onThemeChange?.(newTheme);
    };

    const cycleTheme = () => {
      const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(theme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      cycleTheme();
      onClick?.(e);
    };

    const getIcon = () => {
      switch (theme) {
        case 'light':
          return (
            lightIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )
          );
        case 'dark':
          return (
            darkIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )
          );
        case 'system':
          return (
            systemIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )
          );
      }
    };

    const getLabel = () => {
      const label = theme;
      switch (labelFormat) {
        case 'uppercase':
          return label.toUpperCase();
        case 'lowercase':
          return label.toLowerCase();
        default:
          return label.charAt(0).toUpperCase() + label.slice(1);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(themeToggleButtonVariants({ variant, size, animation }), className)}
        onClick={handleClick}
        {...props}
      >
        <span className={animation}>{getIcon()}</span>
        {(showLabel || children) && <span className="ml-2">{children || getLabel()}</span>}
      </button>
    );
  }
);

ThemeToggleButton.displayName = 'ThemeToggleButton';

export { ThemeToggleButton };
