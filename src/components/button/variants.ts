import { cva } from "class-variance-authority";

// export const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-white hover:bg-primary/90",
//         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//         glass: "backdrop-blur-md bg-white/10 border border-white/20",
//         gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90",
//         social: "flex gap-2 items-center justify-center",
//         threeD: "transform transition-transform active:translate-y-1 shadow-lg",
//       },
//       size: {
//         default: "h-9 px-4 py-2",
//         sm: "h-8 rounded-md px-3 text-xs",
//         lg: "h-10 rounded-md px-8",
//         icon: "h-9 w-9",
//         full: "w-full h-10 px-4",
//       },
//       animation: {
//         none: "",
//         pulse: "animate-pulse",
//         bounce: "animate-bounce",
//         spin: "animate-spin",
//         ping: "animate-ping",
//       },
//       state: {
//         idle: "",
//         loading: "relative after:absolute after:inset-[3px] after:rounded-full after:border-2 after:border-current after:border-r-transparent after:animate-spin",
//         success: "bg-green-500 text-white hover:bg-green-600",
//         error: "bg-red-500 text-white hover:bg-red-600",
//         disabled: "opacity-50 cursor-not-allowed",
//       }
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//       animation: "none",
//       state: "idle",
//     },
//   }
// );
export const buttonVariants = cva(
  "flex items-center min-h-[40px] justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        outline: "bg-transparent border hover:bg-gray-50",
        icon: "bg-transparent border hover:bg-gray-50 rounded-full",
        secondary: "bg-[#F5F7FA]  border hover:bg-gray-50",
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
export const uploadButtonVariants = cva("", {
  variants: {
    isDragging: {
      true: "border-primary",
      false: "border-input"
    },
    loading: {
      true: "opacity-50 cursor-wait",
      false: ""
    }
  },
  defaultVariants: {
    isDragging: false,
    loading: false
  }
});

export const tooltipButtonVariants = cva("", {
  variants: {
    position: {
      top: "tooltip-top",
      bottom: "tooltip-bottom",
      left: "tooltip-left",
      right: "tooltip-right"
    }
  },
  defaultVariants: {
    position: "top"
  }
});

export const themeToggleButtonVariants = cva("", {
  variants: {
    showIcon: {
      true: "",
      false: "hidden"
    },
    showText: {
      true: "",
      false: "hidden"
    }
  },
  defaultVariants: {
    showIcon: true,
    showText: true
  }
});

export const swipeButtonVariants = cva("", {
  variants: {
    direction: {
      left: "swipe-left",
      right: "swipe-right"
    }
  },
  defaultVariants: {
    direction: "right"
  }
});

export const videoPlayButtonVariants = cva("", {
  variants: {
    showProgress: {
      true: "progress-ring",
      false: ""
    }
  },
  defaultVariants: {
    showProgress: false
  }
});

export const voiceCommandButtonVariants = cva("", {
  variants: {
    isListening: {
      true: "listening",
      false: ""
    }
  },
  defaultVariants: {
    isListening: false
  }
});

export const threeDButtonVariants = cva("", {
  variants: {
    depth: {
      sm: "shadow-sm active:translate-y-0.5",
      md: "shadow-md active:translate-y-1",
      lg: "shadow-lg active:translate-y-1.5"
    },
    pressed: {
      true: "translate-y-1",
      false: ""
    }
  },
  defaultVariants: {
    depth: "md",
    pressed: false
  }
});

export const statusButtonVariants = cva("", {
  variants: {
    status: {
      online: "after:bg-green-500",
      offline: "after:bg-red-500",
      away: "after:bg-yellow-500",
      busy: "after:bg-purple-500"
    },
    position: {
      start: "after:left-2",
      end: "after:right-2"
    }
  },
  defaultVariants: {
    status: "offline",
    position: "start"
  }
});

export const splitButtonVariants = cva("", {
  variants: {
    isOpen: {
      true: "border-primary",
      false: ""
    }
  },
  defaultVariants: {
    isOpen: false
  }
});

export const toolbarButtonVariants = cva("", {
  variants: {
    active: {
      true: "bg-accent text-accent-foreground",
      false: ""
    },
    orientation: {
      horizontal: "first:rounded-l-md last:rounded-r-md",
      vertical: "first:rounded-t-md last:rounded-b-md"
    }
  },
  defaultVariants: {
    active: false,
    orientation: "horizontal"
  }
});
