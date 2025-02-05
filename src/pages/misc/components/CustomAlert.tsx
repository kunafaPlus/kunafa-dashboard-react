'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "../../../utils/cn";
import { IoClose } from 'react-icons/io5';
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { BiErrorCircle } from "react-icons/bi";
import { IoInformationCircle } from "react-icons/io5";

const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                default: "bg-white text-gray-800 border-gray-300",
                success: "border-green-500/50 text-green-900 bg-green-50 dark:bg-green-900/30 [&>svg]:text-green-600",
                warning: "border-yellow-500/50 text-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 [&>svg]:text-yellow-600",
                error: "border-red-500/50 text-red-800 bg-red-50 dark:bg-red-900/30 [&>svg]:text-red-600",
                info: "border-blue-500/50 text-blue-800 bg-blue-50 dark:bg-blue-900/30 [&>svg]:text-blue-600",
            },
            size: {
                sm: "text-sm p-3",
                default: "text-base p-4",
                lg: "text-lg p-5",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const icons = {
    success: IoMdCheckmarkCircle,
    warning: IoWarning,
    error: BiErrorCircle,
    info: IoInformationCircle,
    default: IoInformationCircle,
};

interface CustomAlertProps extends VariantProps<typeof alertVariants> {
    className?: string;
    children?: ReactNode;
    icon?: ReactNode;
    title?: string;
    onClose?: () => void;
    showIcon?: boolean;
    message?: string;
    type?: 'error' | 'info' | 'success' | 'warning';
}

export function CustomAlert({
    className,
    children,
    variant = "default",
    size,
    icon,
    title,
    onClose,
    showIcon = true,
    message,
    type,
    ...props
}: CustomAlertProps) {
    const alertRef = useRef<HTMLDivElement>(null);
    const Icon = variant ? icons[variant] : icons.default;

    useEffect(() => {
        if (alertRef.current) {
            alertRef.current.style.opacity = '0';
            setTimeout(() => {
                if (alertRef.current) {
                    alertRef.current.style.opacity = '1';
                }
            }, 10);
        }
    }, []);

    return (
        <div
            ref={alertRef}
            className={cn(
                alertVariants({ variant, size }),
                "transition-opacity duration-300",
                className
            )}
            {...props}
        >
            {showIcon && (icon || <Icon className="h-5 w-5" />)}
            <div className="flex flex-col gap-1">
                {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
                <div className={cn("text-sm opacity-90", !title && "leading-none")}>
                    {children || message}
                </div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 rounded-lg p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                >
                    <IoClose className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}