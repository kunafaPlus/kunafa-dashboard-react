'use client'
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../utils/cn'

const containerVariants = cva(
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

interface ContainerProps extends VariantProps<typeof containerVariants> {
    children: ReactNode
    className?: string
    as?: keyof JSX.IntrinsicElements
}

export function Container({
    children,
    className,
    size,
    padding,
    as: Component = "div",
    ...props
}: ContainerProps) {
    return (
        <Component
            className={cn(containerVariants({ size, padding }), className)}
            {...props}
        >
            {children}
        </Component>
    )
}
