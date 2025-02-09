'use client'
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { DividerProps } from './types'
import { dividerVariants } from './variants'




export function Divider({
    className,
    orientation = "horizontal",
    variant,
    children,
    withLabel = false,
    ...props
}: DividerProps) {
    if (withLabel && children) {
        return (
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className={cn(dividerVariants({ orientation, variant }), className)} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        {children}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                dividerVariants({ orientation, variant }),
                orientation === "vertical" && "mx-[10px] h-4",
                className
            )}
            {...props}
        />
    )
}
