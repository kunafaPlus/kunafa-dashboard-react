'use client'
import { useEffect, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "../../utils/cn";
import { ProgressProps } from './types/type';
import { progressVariants } from './variants';



export function Progress({
    className,
    variant,
    size,
    animated,
    value = 0,
    max = 100,
    showValue = false,
    formatValue = (value) => `${Math.round(value)}%`,
    ...props
}: ProgressProps) {
    const [mounted, setMounted] = useState(false)
    const percentage = (value / max) * 100

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="w-full">
            <div
                className={cn(progressVariants({ variant, size, animated }), className)}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                {...props}
            >
                <div
                    className={cn(
                        "h-full w-full flex-1 bg-primary transition-all",
                        !mounted && "w-0"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showValue && (
                <div className="mt-1 text-sm text-gray-600">
                    {formatValue(percentage)}
                </div>
            )}
        </div>
    )
}

// مكون مخصص للتحميل الدائري
export function CircularProgress({
    size = 40,
    thickness = 4,
    value = 0,
    max = 100,
    showValue = false,
    variant = "default",
    className,
    ...props
}: Omit<ProgressProps, 'size'> & { size?: number; thickness?: number }) {
    const radius = (size - thickness) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (value / max) * circumference

    const variantColors = {
        default: "stroke-primary",
        success: "stroke-green-500",
        warning: "stroke-yellow-500",
        error: "stroke-red-500",
        info: "stroke-blue-500",
    }

    return (
        <div className="relative inline-flex" style={{ width: size, height: size }}>
            <svg className="rotate-[-90deg]" width={size} height={size}>
                <circle
                    className="stroke-gray-200"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={thickness}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn(
                        "transition-all duration-500",
                        variantColors[variant as keyof typeof variantColors]
                    )}
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={thickness}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {Math.round(value)}%
                </div>
            )}
        </div>
    )
}
