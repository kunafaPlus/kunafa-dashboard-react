import { cva } from "class-variance-authority";

export const carouselVariants = cva(
  "relative w-full overflow-hidden",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full",
      },
      variant: {
        default: "",
        bordered: "border rounded-lg",
        shadow: "shadow-xl rounded-lg",
      },
    },
    defaultVariants: {
      size: "full",
      variant: "default",
    },
  }
);

export const navigationButtonVariants = cva(
  "absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-md hover:bg-white focus:outline-none",
  {
    variants: {
      position: {
        left: "left-2",
        right: "right-2",
      },
    },
    defaultVariants: {
      position: "left",
    },
  }
);
