import { cva } from "class-variance-authority";

export const sidebarVariants = cva(
  "relative flex flex-col transition-all duration-300  pr-4", 
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white no-scrollbar ",
        floating: "bg-background/80 backdrop-blur-sm shadow-lg",
        minimal: "bg-transparent",
        colored: "bg-primary text-white",
        gradient: "bg-gradient-to-b from-primary to-secondary text-white",
      },
      size: {
        sm: "w-16",
        default: "w-64",
        lg: "w-80",
      },
      position: {
        left: "left-0",
        right: "right-0",
      },
      collapsed: {
        true: "w-16",
        false: "",
      },
      mobile: {
        true: "absolute inset-y-0 z-50",
        false: "relative",
      },
    },
    compoundVariants: [
      {
        mobile: true,
        collapsed: false,
        className: "w-64",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "left",
      collapsed: false,
      mobile: false,
    },
  }
);

export const sidebarItemVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200", 
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
        subtle: "hover:bg-accent/30",
      },
      active: {
        true: "bg-white text-accent-foreground",
        false: "text-muted-foreground",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "",
      },
      collapsed: {
        true: "justify-center px-0",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
      disabled: false,
      collapsed: false,
    },
  }
);

export const sidebarSectionVariants = cva("", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-2",
      default: "py-2",
      lg: "p-6",
    },
    spacing: {
      none: "space-y-0",
      sm: "space-y-1",
      default: "space-y-1",
      lg: "space-y-4",
    },
  },
  defaultVariants: {
    padding: "default",
    spacing: "default",
  },
});
