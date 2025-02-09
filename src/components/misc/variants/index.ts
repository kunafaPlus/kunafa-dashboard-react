import { cva } from "class-variance-authority";

export const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      variants: {
        variant: {
          default:
            "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
          secondary:
            "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive:
            "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          outline: "text-foreground",
          success: "border-transparent bg-green-500 text-white hover:bg-green-600",
          warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );

  export const breadcrumbVariants = cva("flex items-center space-x-1", {
    variants: {
      variant: {
        default: "",
        bordered: "p-2 border rounded-md",
        ghost: "bg-muted/50 p-2 rounded-md",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  });
  
  export const breadcrumbItemVariants = cva(
    "inline-flex items-center hover:text-foreground",
    {
      variants: {
        variant: {
          default: "text-muted-foreground",
          active: "font-semibold text-foreground",
          link: "text-primary hover:underline",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );
  
 export const breadcrumbSeparatorVariants = cva("mx-2 text-muted-foreground", {
    variants: {
      variant: {
        default: "",
        arrow: "font-bold",
        slash: "text-muted-foreground/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  export const commandVariants = cva(
    "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
    {
      variants: {
        size: {
          default: "",
          sm: "max-w-sm",
          md: "max-w-md",
          lg: "max-w-lg",
          xl: "max-w-xl",
          full: "max-w-full",
        },
      },
      defaultVariants: {
        size: "default",
      },
    }
  );
  
  export const commandInputVariants = cva(
    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
    {
      variants: {
        variant: {
          default: "px-3",
          bordered: "border px-3",
          bottomBorder: "border-b px-3",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );

  export const contextMenuVariants = cva(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    {
      variants: {
        variant: {
          default: "",
          bordered: "border-2",
          ghost: "border-none shadow-none",
        },
        size: {
          sm: "min-w-[8rem]",
          md: "min-w-[12rem]",
          lg: "min-w-[16rem]",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "md",
      },
    }
  );
  
 export  const contextMenuItemVariants = cva(
    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    {
      variants: {
        variant: {
          default: "hover:bg-accent hover:text-accent-foreground",
          destructive:
            "text-destructive hover:bg-destructive hover:text-destructive-foreground",
        },
        inset: {
          true: "pl-8",
          false: "",
        },
      },
      defaultVariants: {
        variant: "default",
        inset: false,
      },
    }
  );

  export const alertVariants = cva(
      "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
      {
          variants: {
              variant: {
                  default: "bg-white text-gray-800 border-gray-300",
                  success: "border-green-500/50 text-green-900 bg-green-50 dark:bg-green-900/30 [&>svg]:text-green-600",
                  warning: "border-yellow-500/50 text-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 [&>svg]:text-yellow-600",
                  error: "border-red-500/50 text-red-800 bg-red-50 dark:bg-red-900/30 [&>svg]:text-red-600",
                  info: "border-blue-500/50 text-blue-800 bg-blue-50 dark:bg-blue-900/30 [&>svg]:text-blue-600",
              },
              size: {
                  sm: "text-sm p-3",
                  default: "text-base p-4",
                  lg: "text-lg p-5",
              }
          },
          defaultVariants: {
              variant: "default",
              size: "default",
          },
      }
  );

  export const tagStyles = cva(
    // base styles
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    {
      variants: {
        variant: {
          primary: "bg-blue-500 text-white hover:bg-blue-600",
          secondary: "bg-gray-500 text-white hover:bg-gray-600",
          accent: "bg-purple-500 text-white hover:bg-purple-600",
          success: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700/20 dark:text-green-400",
          warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-700/20 dark:text-yellow-400",
          danger: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700/20 dark:text-red-400",
          info: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-700/20 dark:text-blue-400",
        },
        size: {
          xs: "h-5 px-2 text-xs",
          sm: "h-7 px-2.5",
          md: "h-8 px-3",
          lg: "h-9 px-4",
          xl: "h-10 px-5",
        },
        shape: {
          default: "rounded-md",
          pill: "rounded-full",
          square: "rounded-none",
        },
      },
      defaultVariants: {
        variant: "primary",
        size: "md",
        shape: "default",
      },
    }
  );
  export const menuVariants = cva(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      {
          variants: {
              size: {
                  sm: "min-w-[8rem]",
                  md: "min-w-[12rem]",
                  lg: "min-w-[16rem]",
              },
              variant: {
                  default: "bg-white border-gray-200",
                  primary: "bg-primary text-white",
                  ghost: "bg-gray-50 border-gray-100",
              }
          },
          defaultVariants: {
              size: "md",
              variant: "default"
          }
      }
  )
  export const paginationVariants = cva(
      "flex items-center gap-1",
      {
          variants: {
              variant: {
                  default: "[&_button]:bg-white [&_button]:border [&_button]:border-gray-300",
                  ghost: "[&_button]:bg-transparent",
                  pills: "[&_button]:rounded-full",
              },
              size: {
                  sm: "[&_button]:h-8 [&_button]:w-8 [&_button]:text-sm",
                  md: "[&_button]:h-10 [&_button]:w-10",
                  lg: "[&_button]:h-12 [&_button]:w-12 [&_button]:text-lg",
              }
          },
          defaultVariants: {
              variant: "default",
              size: "md"
          }
      }
  )

  export const popoverVariants = cva(
    "z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    {
      variants: {
        variant: {
          default: "",
          ghost: "border-none shadow-none",
          bordered: "border-2",
        },
        size: {
          sm: "w-48",
          md: "w-64",
          lg: "w-80",
          auto: "w-auto",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "auto",
      },
    }
  );
  export 
  const skeletonVariants = cva(
      "animate-pulse rounded-md bg-muted",
      {
          variants: {
              variant: {
                  default: "bg-gray-200",
                  dark: "bg-gray-300",
              },
              size: {
                  sm: "h-4",
                  md: "h-6",
                  lg: "h-8",
                  xl: "h-10",
                  "2xl": "h-12",
              }
          },
          defaultVariants: {
              variant: "default",
              size: "md"
          }
      }
  )

  export const sortableVariants = cva("", {
    variants: {
      variant: {
        default: "",
        bordered: "border rounded-lg p-4",
        ghost: "bg-muted/50 rounded-lg p-4",
      },
      layout: {
        vertical: "space-y-2",
        horizontal: "flex space-x-2",
        grid: "grid gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "vertical",
    },
  });

  export const virtualListVariants = cva("relative overflow-auto", {
    variants: {
      variant: {
        default: "",
        bordered: "border rounded-lg",
        ghost: "bg-muted/50 rounded-lg",
      },
      size: {
        sm: "h-[200px]",
        md: "h-[400px]",
        lg: "h-[600px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  });

  



