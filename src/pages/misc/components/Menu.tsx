'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "../../../utils/cn";

const menuVariants = cva(
    "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    {
        variants: {
            size: {
                sm: "min-w-[8rem]",
                md: "min-w-[12rem]",
                lg: "min-w-[16rem]",
            },
            variant: {
                default: "bg-white border-gray-200",
                primary: "bg-primary text-white",
                ghost: "bg-gray-50 border-gray-100",
            }
        },
        defaultVariants: {
            size: "md",
            variant: "default"
        }
    }
)

interface MenuItem {
    label: string
    icon?: ReactNode
    onClick?: () => void
    disabled?: boolean
    danger?: boolean
    divider?: boolean
    href?: string
    items?: MenuItem[]
}

interface MenuProps extends VariantProps<typeof menuVariants> {
    trigger: ReactNode
    items: MenuItem[]
    className?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    offset?: number
}

export function Menu({
    trigger,
    items,
    className,
    size,
    variant,
    placement = 'bottom',
    offset = 8,
    ...props
}: MenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && triggerRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !triggerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getMenuPosition = () => {
        if (!triggerRef.current) return {}
        const rect = triggerRef.current.getBoundingClientRect()
        const positions = {
            top: { top: `${rect.top - offset}px`, transform: 'translateY(-100%)' },
            bottom: { top: `${rect.bottom + offset}px` },
            left: { left: `${rect.left - offset}px`, transform: 'translateX(-100%)' },
            right: { left: `${rect.right + offset}px` }
        }
        return {
            ...positions[placement],
            left: placement === 'left' || placement === 'right' 
                ? positions[placement].left 
                : `${rect.left}px`
        }
    }

    const renderMenuItem = (item: MenuItem) => {
        if (item.divider) {
            return <div className="my-1 h-px bg-gray-200" />
        }

        const itemContent = (
            <div
                className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                    "hover:bg-gray-100 hover:text-gray-900",
                    item.disabled && "pointer-events-none opacity-50",
                    item.danger && "text-red-600 hover:text-red-700",
                    variant === 'primary' && "hover:bg-primary-dark text-white"
                )}
                onClick={() => {
                    if (!item.disabled && item.onClick) {
                        item.onClick()
                        setIsOpen(false)
                    }
                }}
            >
                {item.icon && (
                    <span className="mr-2 h-4 w-4">{item.icon}</span>
                )}
                <span>{item.label}</span>
                {item.items && (
                    <span className="ml-auto">▶</span>
                )}
            </div>
        )

        if (item.href) {
            return (
                <a href={item.href} className="block">
                    {itemContent}
                </a>
            )
        }

        return itemContent
    }

    return (
        <div className="relative inline-block">
            <div
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
            >
                {trigger}
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={cn(
                        menuVariants({ size, variant }),
                        "fixed",
                        className
                    )}
                    style={getMenuPosition()}
                    {...props}
                >
                    {items.map((item, index) => (
                        <div key={index}>
                            {renderMenuItem(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
