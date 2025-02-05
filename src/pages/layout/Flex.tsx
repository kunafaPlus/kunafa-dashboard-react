'use client'
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "../../utils/cn";

const flexVariants = cva(
    "flex",
    {
        variants: {
            direction: {
                row: "flex-row",
                'row-reverse': "flex-row-reverse",
                col: "flex-col",
                'col-reverse': "flex-col-reverse",
            },
            justify: {
                start: "justify-start",
                end: "justify-end",
                center: "justify-center",
                between: "justify-between",
                around: "justify-around",
                evenly: "justify-evenly",
            },
            items: {
                start: "items-start",
                end: "items-end",
                center: "items-center",
                baseline: "items-baseline",
                stretch: "items-stretch",
            },
            wrap: {
                wrap: "flex-wrap",
                'wrap-reverse': "flex-wrap-reverse",
                nowrap: "flex-nowrap",
            },
            gap: {
                0: "gap-0",
                1: "gap-1",
                2: "gap-2",
                3: "gap-3",
                4: "gap-4",
                5: "gap-5",
                6: "gap-6",
                8: "gap-8",
                10: "gap-10",
                12: "gap-12",
            },
            inline: {
                true: "inline-flex",
                false: "flex",
            },
            responsive: {
                none: "",
                col: "flex-col lg:flex-row",
                row: "flex-row lg:flex-col",
            }
        },
        defaultVariants: {
            direction: "row",
            justify: "start",
            items: "start",
            wrap: "nowrap",
            gap: 0,
            inline: false,
            responsive: "none"
        }
    }
)

interface FlexProps extends VariantProps<typeof flexVariants> {
    children: ReactNode
    className?: string
    as?: keyof JSX.IntrinsicElements
    onClick?: () => void
}

export function Flex({
    children,
    className,
    direction,
    justify,
    items,
    wrap,
    gap,
    inline,
    responsive,
    as: Component = "div",
    ...props
}: FlexProps) {
    return (
        <Component
            className={cn(
                flexVariants({
                    direction,
                    justify,
                    items,
                    wrap,
                    gap,
                    inline,
                    responsive,
                }),
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
}

// مكونات مساعدة جاهزة للاستخدام
export function Row({
    children,
    className,
    ...props
}: Omit<FlexProps, 'direction'>) {
    return (
        <Flex
            direction="row"
            className={className}
            {...props}
        >
            {children}
        </Flex>
    )
}

export function Col({
    children,
    className,
    ...props
}: Omit<FlexProps, 'direction'>) {
    return (
        <Flex
            direction="col"
            className={className}
            {...props}
        >
            {children}
        </Flex>
    )
}

export function Center({
    children,
    className,
    ...props
}: Omit<FlexProps, 'justify' | 'items'>) {
    return (
        <Flex
            justify="center"
            items="center"
            className={className}
            {...props}
        >
            {children}
        </Flex>
    )
}

export function Stack({
    children,
    className,
    gap = 4,
    ...props
}: Omit<FlexProps, 'direction' | 'gap'> & { gap?: FlexProps['gap'] }) {
    return (
        <Flex
            direction="col"
            gap={gap}
            className={className}
            {...props}
        >
            {children}
        </Flex>
    )
}

export function HStack({
    children,
    className,
    gap = 4,
    ...props
}: Omit<FlexProps, 'direction' | 'gap'> & { gap?: FlexProps['gap'] }) {
    return (
        <Flex
            direction="row"
            gap={gap}
            className={className}
            {...props}
        >
            {children}
        </Flex>
    )
}
