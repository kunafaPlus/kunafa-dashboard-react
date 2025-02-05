'use client'
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "../../utils/cn";

const gridVariants = cva(
    "grid",
    {
        variants: {
            cols: {
                1: "grid-cols-1",
                2: "grid-cols-2",
                3: "grid-cols-3",
                4: "grid-cols-4",
                5: "grid-cols-5",
                6: "grid-cols-6",
                12: "grid-cols-12",
                auto: "grid-cols-auto",
                'auto-fit': "grid-cols-auto-fit",
            },
            gap: {
                0: "gap-0",
                1: "gap-1",
                2: "gap-2",
                4: "gap-4",
                6: "gap-6",
                8: "gap-8",
                12: "gap-12",
            },
            responsive: {
                true: "md:grid-cols-2 lg:grid-cols-3",
                false: "",
            }
        },
        defaultVariants: {
            cols: 3,
            gap: 4,
            responsive: false
        }
    }
)

interface GridProps extends VariantProps<typeof gridVariants> {
    children: ReactNode
    className?: string
}

export function Grid({
    children,
    className,
    cols,
    gap,
    responsive,
    ...props
}: GridProps) {
    return (
        <div
            className={cn(gridVariants({ cols, gap, responsive }), className)}
            {...props}
        >
            {children}
        </div>
    )
}

// Grid Item Component
const gridItemVariants = cva(
    "",
    {
        variants: {
            colSpan: {
                1: "col-span-1",
                2: "col-span-2",
                3: "col-span-3",
                4: "col-span-4",
                5: "col-span-5",
                6: "col-span-6",
                12: "col-span-12",
                full: "col-span-full",
            },
            rowSpan: {
                1: "row-span-1",
                2: "row-span-2",
                3: "row-span-3",
                4: "row-span-4",
                5: "row-span-5",
                6: "row-span-6",
                full: "row-span-full",
            }
        },
        defaultVariants: {
            colSpan: 1,
            rowSpan: 1
        }
    }
)

interface GridItemProps extends VariantProps<typeof gridItemVariants> {
    children: ReactNode
    className?: string
}

export function GridItem({
    children,
    className,
    colSpan,
    rowSpan,
    ...props
}: GridItemProps) {
    return (
        <div
            className={cn(gridItemVariants({ colSpan, rowSpan }), className)}
            {...props}
        >
            {children}
        </div>
    )
}
