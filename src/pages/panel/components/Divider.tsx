'use client'
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../utils/cn'

const dividerVariants = cva(
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

interface DividerProps extends VariantProps<typeof dividerVariants> {
    className?: string
    children?: ReactNode
    withLabel?: boolean
}

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
