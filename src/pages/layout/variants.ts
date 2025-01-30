import { cva } from "class-variance-authority";

export const navbarVariants = cva(
  "w-full flex items-center transition-all duration-300", 
  {
    variants: {
      variant: {
        default: "bg-background border-b",
        transparent: "bg-transparent",
        floating: "bg-background/80 backdrop-blur-sm shadow-sm",
        colored: "bg-primary text-primary-foreground",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
      },
      size: {
        sm: "h-12",
        default: "h-16",
        lg: "h-20",
      },
      position: {
        static: "relative",
        fixed: "fixed top-0 left-0 right-0 z-50",
        sticky: "sticky top-0 z-50",
      },
      padding: {
        none: "px-0",
        sm: "px-4",
        default: "px-6",
        lg: "px-8",
      },
      border: {
        none: "border-none",
        bottom: "border-b",
        top: "border-t",
        both: "border-y",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "static",
      padding: "default",
      border: "bottom",
    },
  }
);

export const navLinkVariants = cva(
  "relative flex items-center transition-colors duration-200", 
  {
    variants: {
      variant: {
        default: "hover:text-primary",
        underline: "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all hover:after:w-full",
        highlight: "hover:bg-accent hover:text-accent-foreground rounded-md",
        pill: "rounded-full hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "text-sm px-2 py-1",
        default: "px-3 py-2",
        lg: "text-lg px-4 py-2",
      },
      active: {
        true: "text-primary font-medium",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
    },
  }
);
