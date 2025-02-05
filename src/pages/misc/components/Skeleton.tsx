'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "../../../utils/cn";

const skeletonVariants = cva(
    "animate-pulse rounded-md bg-muted",
    {
        variants: {
            variant: {
                default: "bg-gray-200",
                dark: "bg-gray-300",
            },
            size: {
                sm: "h-4",
                md: "h-6",
                lg: "h-8",
                xl: "h-10",
                "2xl": "h-12",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "md"
        }
    }
)

interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
    className?: string
    width?: string | number
    height?: string | number
    circle?: boolean
}

export function Skeleton({
    className,
    variant,
    size,
    width,
    height,
    circle,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                skeletonVariants({ variant, size }),
                circle && "rounded-full",
                className
            )}
            style={{
                width: width,
                height: height,
            }}
            {...props}
        />
    )
}

// مكونات جاهزة للاستخدام
export function SkeletonText({ className, ...props }: SkeletonProps) {
    return (
        <Skeleton
            className={cn("w-[200px]", className)}
            size="sm"
            {...props}
        />
    )
}

export function SkeletonCircle({ className, size = "md", ...props }: SkeletonProps) {
    const sizeMap = {
        sm: 32,
        md: 40,
        lg: 48,
        xl: 56,
        "2xl": 64,
    }
    
    return (
        <Skeleton
            circle
            width={sizeMap[size as keyof typeof sizeMap]}
            height={sizeMap[size as keyof typeof sizeMap]}
            className={className}
            {...props}
        />
    )
}

export function SkeletonButton({ className, ...props }: SkeletonProps) {
    return (
        <Skeleton
            className={cn("w-[100px]", className)}
            size="md"
            {...props}
        />
    )
}

export function SkeletonImage({ className, ...props }: SkeletonProps) {
    return (
        <Skeleton
            className={cn("h-[200px] w-full", className)}
            {...props}
        />
    )
}
