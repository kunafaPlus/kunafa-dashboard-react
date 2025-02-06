import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        gradient: 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90',
        glass: 'backdrop-blur-md bg-white/10 text-white hover:bg-white/20',
        threeDimensional: 'transform hover:-translate-y-1 shadow-lg hover:shadow-xl transition-all',
        split: 'relative group inline-flex',
        status: 'relative inline-flex items-center',
        swipe: 'relative overflow-hidden',
        switch: 'relative inline-flex h-6 w-11 items-center rounded-full',
        theme: 'relative inline-flex items-center justify-center rounded-full',
        toolbar: 'relative inline-flex items-center justify-center',
        tooltip: 'relative inline-flex',
        upload: 'relative inline-flex items-center justify-center',
        video: 'relative inline-flex items-center justify-center rounded-full',
        voice: 'relative inline-flex items-center justify-center',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
        full: 'w-full h-10',
        circle: 'rounded-full',
      },
      state: {
        idle: '',
        active: 'ring-2 ring-primary',
        loading: 'animate-pulse',
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        spin: 'animate-spin',
        ping: 'animate-ping',
        slide: 'transition-transform duration-200',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'idle',
      animation: 'none',
    },
  }
);

// Split Button Variants
export const splitButtonVariants = cva('inline-flex rounded-md shadow-sm', {
  variants: {
    variant: {
      default: '[&>*:first-child]:bg-primary [&>*:first-child]:text-white [&>*:last-child]:bg-primary [&>*:last-child]:text-white',
      destructive: '[&>*:first-child]:bg-destructive [&>*:last-child]:bg-destructive',
      outline: '[&>*]:border [&>*]:border-input [&>*]:bg-background',
      secondary: '[&>*]:bg-secondary [&>*]:text-secondary-foreground',
    },
    size: {
      default: '[&>*:first-child]:h-9 [&>*:first-child]:px-4 [&>*:last-child]:h-9 [&>*:last-child]:w-9',
      sm: '[&>*:first-child]:h-8 [&>*:first-child]:px-3 [&>*:last-child]:h-8 [&>*:last-child]:w-8',
      lg: '[&>*:first-child]:h-10 [&>*:first-child]:px-8 [&>*:last-child]:h-10 [&>*:last-child]:w-10',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Status Button Variants
export const statusButtonVariants = cva('inline-flex items-center gap-2', {
  variants: {
    status: {
      online: 'text-green-500',
      offline: 'text-gray-500',
      away: 'text-yellow-500',
      busy: 'text-red-500',
      custom: '',
    },
    size: {
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: { status: 'offline', size: 'default' },
});

// Swipe Button Variants
export const swipeButtonVariants = cva('relative overflow-hidden', {
  variants: {
    variant: {
      default: 'bg-primary text-white',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border border-input bg-background',
    },
    direction: {
      left: 'flex-row',
      right: 'flex-row-reverse',
    },
  },
  defaultVariants: { variant: 'default', direction: 'right' },
});

// Switch Button Variants
export const switchButtonVariants = cva('relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors', {
  variants: {
    variant: {
      default: 'bg-gray-200 data-[state=checked]:bg-primary',
      colored: 'bg-gray-200 data-[state=checked]:bg-green-500',
    },
    size: {
      sm: 'h-5 w-9',
      default: 'h-6 w-11',
      lg: 'h-7 w-14',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Theme Toggle Button Variants
export const themeToggleVariants = cva('rounded-full transition-colors', {
  variants: {
    variant: {
      default: 'bg-transparent hover:bg-accent',
      outline: 'border border-input hover:bg-accent',
    },
    size: {
      sm: 'h-8 w-8',
      default: 'h-10 w-10',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// 3D Button Variants
export const threeDButtonVariants = cva('relative transform transition-all duration-200', {
  variants: {
    variant: {
      default: 'bg-primary text-white shadow-primary/50',
      destructive: 'bg-destructive text-destructive-foreground shadow-destructive/50',
      outline: 'bg-background border border-input shadow-gray-400/50',
    },
    depth: {
      sm: 'translate-y-[-2px] shadow-[0_2px_0]',
      default: 'translate-y-[-4px] shadow-[0_4px_0]',
      lg: 'translate-y-[-6px] shadow-[0_6px_0]',
    },
  },
  defaultVariants: { variant: 'default', depth: 'default' },
});

// Toggle Button Variants
export const toggleButtonVariants = cva('inline-flex items-center justify-center transition-colors', {
  variants: {
    variant: {
      default: 'data-[state=on]:bg-primary data-[state=off]:bg-gray-200',
      outline: 'border border-input data-[state=on]:bg-accent',
    },
    size: {
      sm: 'h-8 px-3',
      default: 'h-10 px-4',
      lg: 'h-12 px-6',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Toolbar Button Variants
export const toolbarButtonVariants = cva('inline-flex items-center justify-center rounded-md transition-colors', {
  variants: {
    variant: {
      default: 'hover:bg-accent',
      active: 'bg-accent text-accent-foreground',
    },
    size: {
      sm: 'h-8 w-8',
      default: 'h-10 w-10',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Tooltip Button Variants
export const tooltipButtonVariants = cva('inline-flex items-center justify-center rounded-md transition-colors', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent',
    },
    size: {
      sm: 'h-8 px-3',
      default: 'h-10 px-4',
      lg: 'h-12 px-6',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Upload Button Variants
export const uploadButtonVariants = cva('relative inline-flex items-center justify-center transition-colors', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border-2 border-dashed border-input hover:border-primary',
    },
    size: {
      sm: 'h-32 w-32',
      default: 'h-40 w-40',
      lg: 'h-48 w-48',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Video Play Button Variants
export const videoPlayButtonVariants = cva('rounded-full transition-colors', {
  variants: {
    variant: {
      default: 'bg-black/50 text-white hover:bg-black/70',
      light: 'bg-white/50 text-black hover:bg-white/70',
    },
    size: {
      sm: 'h-8 w-8',
      default: 'h-12 w-12',
      lg: 'h-16 w-16',
      xl: 'h-20 w-20',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Voice Command Button Variants
export const voiceCommandVariants = cva('relative inline-flex items-center justify-center rounded-full transition-all', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      listening: 'bg-red-500 text-white animate-pulse',
      processing: 'bg-yellow-500 text-white',
    },
    size: {
      sm: 'h-8 w-8',
      default: 'h-12 w-12',
      lg: 'h-16 w-16',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export const baseButtonVariants = cva(
  "group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);




