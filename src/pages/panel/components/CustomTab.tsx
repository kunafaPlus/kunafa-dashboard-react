'use client'
import { ReactNode, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../utils/cn'

const tabListVariants = cva(
    "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
    {
        variants: {
            variant: {
                default: "bg-gray-100",
                pills: "bg-transparent gap-2",
                underline: "bg-transparent border-b",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto"
            }
        },
        defaultVariants: {
            variant: "default",
            fullWidth: false
        }
    }
)

const tabTriggerVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                pills: "rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white",
                underline: "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto"
            }
        },
        defaultVariants: {
            variant: "default",
            fullWidth: false
        }
    }
)

interface TabItem {
    label: string
    value: string
    content: ReactNode
    icon?: ReactNode
    disabled?: boolean
}

interface CustomTabProps extends VariantProps<typeof tabListVariants> {
    items: TabItem[]
    defaultValue?: string
    className?: string
    onChange?: (value: string) => void
}

export function CustomTab({
    items,
    defaultValue,
    className,
    variant = "default",
    fullWidth,
    onChange,
    ...props
}: CustomTabProps) {
    const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value)

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        onChange?.(value)
    }

    return (
        <div className="w-full space-y-4">
            <div className={cn(tabListVariants({ variant, fullWidth }), className)} role="tablist">
                {items.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => handleTabChange(item.value)}
                        disabled={item.disabled}
                        data-state={activeTab === item.value ? "active" : "inactive"}
                        className={cn(
                            tabTriggerVariants({ variant, fullWidth }),
                            variant === "underline" && "border-b-2 border-transparent"
                        )}
                        role="tab"
                        aria-selected={activeTab === item.value}
                    >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="mt-2">
                {items.find(item => item.value === activeTab)?.content}
            </div>
        </div>
    )
}
