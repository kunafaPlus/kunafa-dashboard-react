'use client'
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { ContainerProps } from './types'
import { containerVariants } from './variants'




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
