'use client'
import { ReactNode, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { CustomTabProps } from './types'
import { tabListVariants, tabTriggerVariants } from './variants'





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
