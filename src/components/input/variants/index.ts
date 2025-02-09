import { cva } from "class-variance-authority";

export const calendarVariants = cva(
  "p-3 space-y-4 bg-background rounded-lg shadow-sm ",
  {
    variants: {
      variant: {
        default: "",
        ghost: "shadow-none border-none",
      },
      size: {
        sm: "max-w-[280px]",
        md: "max-w-[320px]",
        lg: "max-w-[380px]",
        xl: "max-w-[440px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);


export const cascadeSelectVariants = cva(
  "relative inline-flex flex-col gap-1 w-full ",
  {
    variants: {
      variant: {
        default: "",
        bordered: "p-1  rounded-md",
        ghost: "bg-muted/50",
      },
      size: {
        sm: "[&_select]:text-sm [&_select]:p-1",
        md: "[&_select]:text-base [&_select]:p-2",
        lg: "[&_select]:text-lg [&_select]:p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const colorPaletteInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2 gap-2",
        md: "p-3 gap-3",
        lg: "p-4 gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const colorPickerVariants = cva("relative rounded-md border bg-background", {
  variants: {
    variant: {
      default: "",
      bordered: "border-2",
      ghost: "border-none shadow-none",
    },
    size: {
      sm: "w-48",
      md: "w-64",
      lg: "w-80",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
export const dualRangeSliderVariants = cva(
  "relative w-full touch-none select-none",
  {
    variants: {
      variant: {
        default: "",
        filled: "[&_.slider-track]:bg-muted",
        ghost: "[&_.slider-track]:bg-transparent",
      },
      size: {
        sm: "h-4",
        md: "h-5",
        lg: "h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const fileDropzoneVariants = cva(
  "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors",
  {
    variants: {
      variant: {
        default: "border-muted-foreground/25 hover:border-muted-foreground/50",
        filled: "bg-muted border-transparent hover:border-primary",
        ghost: "border-transparent hover:border-primary",
      },
      size: {
        sm: "p-4 min-h-[100px]",
        md: "p-6 min-h-[150px]",
        lg: "p-8 min-h-[200px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export const fileUploaderVariants = cva(
  "relative rounded-lg border-2 border-dashed transition-colors",
  {
    variants: {
      variant: {
        default: "border-muted-foreground/25 hover:border-muted-foreground/50",
        accent: "border-primary/25 hover:border-primary/50",
        ghost: "border-transparent bg-muted/50",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export  const floatLabelVariants = cva(
  "relative inline-block w-full",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b [&_input]:rounded-t-md",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2 [&_label]:text-xs",
        md: "[&_input]:text-base [&_input]:p-3 [&_label]:text-sm",
        lg: "[&_input]:text-lg [&_input]:p-4 [&_label]:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const iconFieldVariants = cva(
  "relative inline-flex items-center w-full group",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2 [&_svg]:w-4 [&_svg]:h-4",
        md: "[&_input]:text-base [&_input]:p-3 [&_svg]:w-5 [&_svg]:h-5",
        lg: "[&_input]:text-lg [&_input]:p-4 [&_svg]:w-6 [&_svg]:h-6",
      },
      iconPosition: {
        left: "",
        right: "flex-row-reverse",
        both: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      iconPosition: "left",
    },
  }
);
export const inputVariants = cva(
  "flex-1 w-full focus:outline-none focus:ring-2 focus:ring-primary border-2 transition-all rounded-md",
  {
    variants: {
      variant: {
        default: "border-primary",
        error: "border-red-500",
      },
      size: {
        default: "py-3 px-3",
        sm: "py-2 px-2",
        lg: "py-4 px-4",
      },
      hasIcon: {
        true: "pl-10 rtl:pl-3 rtl:pr-10",
        false: "",
      },
      hasEndText: {
        true: "pr-20 rtl:pr-3 rtl:pl-20",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hasIcon: false,
      hasEndText: false,
    },
  }
);

export  const inputGroupVariants = cva(
  "flex items-stretch w-full border border-gray-200 rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "[&_input]:border-0 [&_input]:rounded-none [&_button]:border-0 [&_button]:rounded-none",
        filled: "[&_input]:bg-muted [&_input]:border-b-0 [&_button]:bg-muted [&_button]:border-b-0",
        ghost: "[&_input]:bg-transparent [&_input]:border-b-0 [&_button]:bg-transparent [&_button]:border-b-0",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2 [&_button]:text-sm [&_button]:p-2",
        md: "[&_input]:text-base [&_input]:p-3 [&_button]:text-base [&_button]:p-3",
        lg: "[&_input]:text-lg [&_input]:p-4 [&_button]:text-lg [&_button]:p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const inputMaskVariants = cva(
  "w-full transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border rounded-md",
        filled: "bg-muted border-b",
        ghost: "bg-transparent border-b",
      },
      size: {
        sm: "text-sm p-2",
        md: "text-base p-3",
        lg: "text-lg p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export  const inputNumberVariants = cva(
  "relative inline-flex w-full",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2 [&_button]:text-sm",
        md: "[&_input]:text-base [&_input]:p-3 [&_button]:text-base",
        lg: "[&_input]:text-lg [&_input]:p-4 [&_button]:text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const jsonInputVariants = cva(
  "w-full min-h-[16rem]",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
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
export const listBoxVariants = cva(
  "w-full overflow-auto border rounded-lg bg-background",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "bg-muted/50 border-none",
      },
      size: {
        sm: "max-h-[200px]",
        md: "max-h-[300px]",
        lg: "max-h-[400px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export  const matrixInputVariants = cva(
  "w-full",
  
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-1",
        md: "[&_input]:text-base [&_input]:p-2",
        lg: "[&_input]:text-lg [&_input]:p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const mentionInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "[&_textarea]:border [&_textarea]:rounded-md",
        filled: "[&_textarea]:bg-muted [&_textarea]:border-b",
        ghost: "[&_textarea]:bg-transparent [&_textarea]:border-b",
      },
      size: {
        sm: "[&_textarea]:text-sm [&_textarea]:p-2",
        md: "[&_textarea]:text-base [&_textarea]:p-3",
        lg: "[&_textarea]:text-lg [&_textarea]:p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export const multiSelectVariants = cva(
  "relative w-full rounded-md border border-border-primary bg-background text-sm",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "border-none bg-muted/50",
      },
      size: {
        sm: "px-2 py-1",
        md: "px-3 py-2",
        lg: "px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const multiStateCheckboxVariants = cva(
  "inline-flex items-center justify-center rounded transition-colors outline-input-focus border-input-border focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-background border",
        filled: "bg-muted",
        ghost: "bg-transparent hover:bg-accent",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export const otpInputVariants = cva("flex items-center justify-center gap-2", {
  variants: {
    variant: {
      default: "",
      bordered: "p-4 border rounded-lg",
      ghost: "p-4 bg-muted/50 rounded-lg",
    },
    size: {
      sm: "[&_input]:w-8 [&_input]:h-8 [&_input]:text-lg",
      md: "[&_input]:w-10 [&_input]:h-10 [&_input]:text-xl",
      lg: "[&_input]:w-12 [&_input]:h-12 [&_input]:text-2xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
export const passwordVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2",
        md: "[&_input]:text-base [&_input]:p-3",
        lg: "[&_input]:text-lg [&_input]:p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const passwordInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "text-sm py-1 px-2",
        md: "text-base py-2 px-3",
        lg: "text-lg py-3 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const phoneInputVariants = cva(
  "w-full px-4",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
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
export const progressVariants = cva(
    "relative w-full overflow-hidden rounded-full bg-secondary",
    {
        variants: {
            variant: {
                default: "[&>div]:bg-primary",
                success: "[&>div]:bg-green-500",
                warning: "[&>div]:bg-yellow-500",
                error: "[&>div]:bg-red-500",
                info: "[&>div]:bg-blue-500",
            },
            size: {
                sm: "h-2",
                md: "h-3",
                lg: "h-4",
                xl: "h-5",
            },
            animated: {
                true: "[&>div]:transition-all [&>div]:duration-500",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            animated: true
        }
    }
)
export const ratingVariants = cva("flex items-center", {
  variants: {
    variant: {
      default: "",
      bordered: "p-2 border rounded-md",
      ghost: "p-2 bg-muted/50 rounded-md",
    },
    size: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export const iconVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
export const richTextEditorVariants = cva(
  "w-full rounded-lg border bg-background",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "border-none bg-muted/50",
      },
      size: {
        sm: "min-h-[100px]",
        md: "min-h-[200px]",
        lg: "min-h-[300px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const richTextInputVariants = cva(
  "w-full min-h-[16rem]",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
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
export  const scheduleInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const searchInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "text-sm py-1 px-2",
        md: "text-base py-2 px-3",
        lg: "text-lg py-3 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export  const selectVariants = cva(
  "flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        ghost: "border-none shadow-none",
        underline: "rounded-none border-t-0 border-l-0 border-r-0 px-0",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-[200px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
);

export const optionListVariants = cva(
  "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  {
    variants: {
      position: {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
      },
      align: {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
      },
    },
    defaultVariants: {
      position: "bottom",
      align: "start",
    },
  }
);
export  const signaturePadVariants = cva(
  "relative border rounded-md overflow-hidden touch-none",
  {
    variants: {
      variant: {
        default: "border-input",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "min-h-[100px]",
        md: "min-h-[150px]",
        lg: "min-h-[200px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export const sliderVariants = cva("relative flex w-full touch-none select-none items-center", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col h-full",
    },
    size: {
      sm: "[--slider-height:0.5rem]",
      md: "[--slider-height:0.75rem]",
      lg: "[--slider-height:1rem]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
});

export const sliderTrackVariants = cva(
  "relative grow rounded-full bg-secondary",
  {
    variants: {
      orientation: {
        horizontal: "h-[--slider-height]",
        vertical: "w-[--slider-height] h-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

export const sliderRangeVariants = cva(
  "absolute rounded-full bg-primary",
  {
    variants: {
      orientation: {
        horizontal: "h-full",
        vertical: "w-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

export const sliderThumbVariants = cva(
  "block rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);


export const switchTrackVariants = cva(
  "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      size: {
        sm: "h-4 w-8",
        md: "h-5 w-10",
        lg: "h-6 w-12",
      },
      variant: {
        default: "bg-gray-300",
        primary: "bg-blue-500",
        success: "bg-green-500",
        danger: "bg-red-500",
        warning: "bg-yellow-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export const switchThumbVariants = cva(
  "inline-block rounded-full bg-white shadow-md transform transition-transform duration-200",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
export const tagInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2",
        md: "[&_input]:text-base [&_input]:p-3",
        lg: "[&_input]:text-lg [&_input]:p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export const timeRangePickerVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2",
        md: "[&_input]:text-base [&_input]:p-3",
        lg: "[&_input]:text-lg [&_input]:p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export  const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted",
        primary: "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3 rounded-sm",
        default: "h-10 px-4 rounded-md",
        lg: "h-12 px-6 rounded-lg",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "md",
    },
  }
);
export const voiceInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
