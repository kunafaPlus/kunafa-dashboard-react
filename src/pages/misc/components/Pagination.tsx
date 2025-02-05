'use client'
import { useEffect, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "../../../utils/cn";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"

const paginationVariants = cva(
    "flex items-center gap-1",
    {
        variants: {
            variant: {
                default: "[&_button]:bg-white [&_button]:border [&_button]:border-gray-300",
                ghost: "[&_button]:bg-transparent",
                pills: "[&_button]:rounded-full",
            },
            size: {
                sm: "[&_button]:h-8 [&_button]:w-8 [&_button]:text-sm",
                md: "[&_button]:h-10 [&_button]:w-10",
                lg: "[&_button]:h-12 [&_button]:w-12 [&_button]:text-lg",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "md"
        }
    }
)

interface PaginationProps extends VariantProps<typeof paginationVariants> {
    className?: string
    total: number
    perPage?: number
    currentPage?: number
    siblingCount?: number
    onChange?: (page: number) => void
    showFirstLast?: boolean
    showPrevNext?: boolean
    disabled?: boolean
}

export function Pagination({
    className,
    variant,
    size,
    total,
    perPage = 10,
    currentPage = 1,
    siblingCount = 1,
    onChange,
    showFirstLast = true,
    showPrevNext = true,
    disabled = false,
    ...props
}: PaginationProps) {
    const [page, setPage] = useState(currentPage)
    const totalPages = Math.ceil(total / perPage)

    useEffect(() => {
        setPage(currentPage)
    }, [currentPage])

    const handlePageChange = (newPage: number) => {
        if (disabled || newPage < 1 || newPage > totalPages) return
        setPage(newPage)
        onChange?.(newPage)
    }

    const generatePaginationRange = () => {
        const range = []
        const leftSiblingIndex = Math.max(page - siblingCount, 1)
        const rightSiblingIndex = Math.min(page + siblingCount, totalPages)

        const shouldShowLeftDots = leftSiblingIndex > 2
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1)
            return [...leftRange, '...', totalPages]
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightRange = Array.from(
                { length: 3 + 2 * siblingCount },
                (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
            )
            return [1, '...', ...rightRange]
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            )
            return [1, '...', ...middleRange, '...', totalPages]
        }

        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const paginationRange = generatePaginationRange()

    const buttonClasses = cn(
        "flex items-center justify-center rounded-md transition-colors",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        disabled && "pointer-events-none opacity-50",
        variant === 'ghost' && "hover:bg-gray-100",
        variant === 'default' && "border border-gray-300",
    )

    return (
        <nav
            className={cn(paginationVariants({ variant, size }), className)}
            {...props}
        >
            {showFirstLast && (
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1 || disabled}
                    className={buttonClasses}
                    aria-label="First page"
                >
                    ««
                </button>
            )}

            {showPrevNext && (
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || disabled}
                    className={buttonClasses}
                    aria-label="Previous page"
                >
                    <IoChevronBack />
                </button>
            )}

            {paginationRange.map((pageNumber, idx) => {
                if (pageNumber === '...') {
                    return (
                        <span
                            key={`dots-${idx}`}
                            className="flex h-10 w-10 items-center justify-center text-gray-500"
                        >
                            ⋯
                        </span>
                    )
                }

                return (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber as number)}
                        disabled={disabled}
                        className={cn(
                            buttonClasses,
                            page === pageNumber && "bg-primary text-white hover:bg-primary/90"
                        )}
                    >
                        {pageNumber}
                    </button>
                )
            })}

            {showPrevNext && (
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || disabled}
                    className={buttonClasses}
                    aria-label="Next page"
                >
                    <IoChevronForward />
                </button>
            )}

            {showFirstLast && (
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages || disabled}
                    className={buttonClasses}
                    aria-label="Last page"
                >
                    »»
                </button>
            )}
        </nav>
    )
}