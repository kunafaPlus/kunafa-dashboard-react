'use client'
import { ReactNode, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { IoChevronDown } from "react-icons/io5"
import { cn } from '../../../utils/cn'

const accordionVariants = cva(
    "w-full",
    {
        variants: {
            variant: {
                default: "divide-y divide-gray-200",
                bordered: "border rounded-lg",
                separated: "space-y-2",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

interface AccordionItem {
    title: ReactNode
    content: ReactNode
    disabled?: boolean
    icon?: ReactNode
}

interface AccordionProps extends VariantProps<typeof accordionVariants> {
    items: AccordionItem[]
    className?: string
    multiple?: boolean
    defaultExpanded?: string[]
    iconPosition?: 'left' | 'right'
}

export function Accordion({
    items,
    className,
    variant,
    multiple = false,
    defaultExpanded = [],
    iconPosition = 'right',
    ...props
}: AccordionProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded)

    const toggleItem = (index: string) => {
        if (multiple) {
            setExpandedItems(prev =>
                prev.includes(index)
                    ? prev.filter(item => item !== index)
                    : [...prev, index]
            )
        } else {
            setExpandedItems(prev =>
                prev.includes(index) ? [] : [index]
            )
        }
    }

    return (
        <div
            className={cn(
                accordionVariants({ variant }),
                className
            )}
            {...props}
        >
            {items.map((item, idx) => {
                const isExpanded = expandedItems.includes(idx.toString())
                return (
                    <div
                        key={idx}
                        className={cn(
                            "transition-all duration-200",
                            variant === 'bordered' && "border-b last:border-b-0",
                            variant === 'separated' && "border rounded-lg"
                        )}
                    >
                        <button
                            onClick={() => !item.disabled && toggleItem(idx.toString())}
                            className={cn(
                                "flex w-full items-center justify-between px-4 py-4 text-right",
                                item.disabled && "cursor-not-allowed opacity-50",
                                variant === 'separated' && "rounded-lg",
                                isExpanded && "bg-gray-50"
                            )}
                            disabled={item.disabled}
                            aria-expanded={isExpanded}
                        >
                            <div className={cn(
                                "flex items-center gap-2",
                                iconPosition === 'right' && "flex-row-reverse justify-end w-full"
                            )}>
                                {item.icon}
                                <span className="text-sm font-medium">{item.title}</span>
                            </div>
                            <IoChevronDown
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-transform duration-200",
                                    isExpanded && "rotate-180"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-300",
                                isExpanded ? "max-h-96" : "max-h-0"
                            )}
                        >
                            <div className="px-4 pb-4 pt-0">
                                {item.content}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
