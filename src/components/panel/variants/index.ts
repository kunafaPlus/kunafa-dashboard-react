import { cva } from "class-variance-authority"

export const accordionVariants = cva(
    "w-full",
    {
        variants: {
            variant: {
                default: "divide-y divide-gray-200",
                bordered: "border rounded-lg",
                separated: "space-y-2",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)
export const containerVariants = cva(
    "mx-auto w-full px-4 sm:px-6 lg:px-8",
    {
        variants: {
            size: {
                sm: "max-w-3xl",
                md: "max-w-5xl",
                lg: "max-w-7xl",
                xl: "max-w-[96rem]",
                full: "max-w-full",
            },
            padding: {
                none: "px-0",
                sm: "px-4",
                md: "px-6",
                lg: "px-8",
                xl: "px-12",
            }
        },
        defaultVariants: {
            size: "lg",
            padding: "md"
        }
    }
)
export const tabListVariants = cva(
    "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
    {
        variants: {
            variant: {
                default: "bg-gray-100",
                pills: "bg-transparent gap-2",
                underline: "bg-transparent border-b",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto"
            }
        },
        defaultVariants: {
            variant: "default",
            fullWidth: false
        }
    }
)

// export const tabTriggerVariants = cva(
//     "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//     {
//         variants: {
//             variant: {
//                 default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
//                 pills: "rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white",
//                 underline: "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary",
//             },
//             fullWidth: {
//                 true: "w-full",
//                 false: "w-auto"
//             }
//         },
//         defaultVariants: {
//             variant: "default",
//             fullWidth: false
//         }
//     }
// )
export const dividerVariants = cva(
    "shrink-0 bg-border",
    {
        variants: {
            orientation: {
                horizontal: "h-[1px] w-full",
                vertical: "h-full w-[1px]"
            },
            variant: {
                default: "bg-gray-200",
                primary: "bg-primary/20",
                dashed: "border-dashed border-gray-200 bg-transparent",
            }
        },
        defaultVariants: {
            orientation: "horizontal",
            variant: "default"
        }
    }
)

export const drawerVariants = cva(
  "fixed z-50 bg-background shadow-lg transition-transform duration-300 ease-in-out",
  {
    variants: {
      position: {
        left: "inset-y-0 left-0 h-full transform -translate-x-full data-[state=open]:translate-x-0",
        right: "inset-y-0 right-0 h-full transform translate-x-full data-[state=open]:translate-x-0",
        top: "inset-x-0 top-0 w-full transform -translate-y-full data-[state=open]:translate-y-0",
        bottom:
          "inset-x-0 bottom-0 w-full transform translate-y-full data-[state=open]:translate-y-0",
      },
      size: {
        sm: "w-64",
        md: "w-80",
        lg: "w-96",
        xl: "w-1/2",
        full: "w-screen",
      },
    },
    defaultVariants: {
      position: "right",
      size: "md",
    },
  }
);

export const drawerOverlayVariants = cva(
  "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in",
  {
    variants: {
      variant: {
        default: "",
        blur: "backdrop-blur-sm",
        dark: "bg-black/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const scrollAreaVariants = cva("relative overflow-hidden", {
  variants: {
    orientation: {
      vertical: "h-full",
      horizontal: "w-full",
      both: "h-full w-full",
    },
    size: {
      sm: "max-h-[200px]",
      md: "max-h-[400px]",
      lg: "max-h-[600px]",
      xl: "max-h-[800px]",
      custom: "",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    size: "md",
  },
});

export const scrollbarVariants = cva(
  "flex touch-none select-none transition-colors",
  {
    variants: {
      orientation: {
        vertical: "h-full w-2.5 border-l border-l-transparent p-[1px]",
        horizontal: "h-2.5 border-t border-t-transparent p-[1px]",
      },
      variant: {
        default: "",
        thin: "w-1.5",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      variant: "default",
    },
  }
);

export const thumbVariants = cva(
  "relative flex-1 rounded-full bg-border hover:bg-accent",
  {
    variants: {
      variant: {
        default: "",
        thin: "w-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
export const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
      size: {
        default: "",
        sm: "sm:max-w-sm",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        full: "sm:max-w-full",
      },
    },
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
);
export const splitterVariants = cva("flex", {
  variants: {
    variant: {
      default: "",
      bordered: "[&>*]:border",
      ghost: "[&>*]:bg-muted/50",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col h-[500px]",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
  },
});

export const gutterVariants = cva(
  "flex items-center justify-center hover:bg-accent transition-colors",
  {
    variants: {
      orientation: {
        horizontal: "cursor-col-resize",
        vertical: "cursor-row-resize",
      },
      size: {
        sm: "[&.horizontal]:w-1 [&.vertical]:h-1",
        md: "[&.horizontal]:w-2 [&.vertical]:h-2",
        lg: "[&.horizontal]:w-3 [&.vertical]:h-3",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
    },
  }
);
export const stepperVariants = cva(
    "relative flex w-full justify-between",
    {
        variants: {
            variant: {
                default: "",
                vertical: "flex-col space-y-4",
            },
            size: {
                sm: "[&_button]:h-8 [&_button]:w-8 text-sm",
                md: "[&_button]:h-10 [&_button]:w-10",
                lg: "[&_button]:h-12 [&_button]:w-12 text-lg",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "md"
        }
    }
)

export const tabsRootVariants = cva("w-full", {
  variants: {
    orientation: {
      horizontal: "space-y-2",
      vertical: "flex space-x-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});



export const tabTriggerVariants = cva(
  "inline-flex items-center border-b-2 border-primary  justify-center whitespace-nowrap rounded-sm px-3 py-1.5 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-b-2 rounded-none data-[state=active]:border-primary",
        pill: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      fullWidth: false,
    },
  }
);

export const tabContentVariants = cva("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", {
  variants: {
    variant: {
      default: "",
      bordered: "border rounded-md p-4",
      shadow: "shadow-lg rounded-md p-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
export const timelineVariants = cva("relative space-y-2", {
  variants: {
    variant: {
      default: "",
      bordered: "p-4 border rounded-lg",
      ghost: "p-4 bg-muted/50 rounded-lg",
    },
    orientation: {
      vertical: "",
      horizontal: "flex space-y-0 space-x-4",
    },
    lineStyle: {
      solid: "",
      dashed: "[&_[data-line]]:border-dashed",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "vertical",
    lineStyle: "solid",
  },
});

export const timelineItemVariants = cva("relative", {
  variants: {
    variant: {
      default: "",
      success: "[&_[data-dot]]:bg-green-500",
      warning: "[&_[data-dot]]:bg-yellow-500",
      error: "[&_[data-dot]]:bg-red-500",
      info: "[&_[data-dot]]:bg-blue-500",
    },
    orientation: {
      vertical: "pl-6",
      horizontal: "pt-6",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "vertical",
  },
});

export const treeViewVariants = cva(
  "w-full overflow-auto",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border rounded-md p-2",
        ghost: "bg-background/50",
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
  }
);


