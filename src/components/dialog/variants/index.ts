import { cva } from "class-variance-authority";

export const dialogVariants = cva(
    "fixed w-full transform overflow-hidden bg-white shadow-xl transition-all duration-300",
    {
        variants: {
            size: {
                sm: "max-w-sm",
                md: "max-w-md",
                lg: "max-w-lg",
                xl: "max-w-xl",
                full: "max-w-[90%]"
            },
            variant: {
                default: "bg-white",
                warning: "bg-yellow-50",
                danger: "bg-red-50",
                success: "bg-green-50"
            },
            rounded: {
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                "2xl": "rounded-2xl",
                full: "rounded-full"
            }
        },
        defaultVariants: {
            size: "md",
            variant: "default",
            rounded: "2xl"
        }
    }
)