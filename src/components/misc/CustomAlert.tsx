'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "../../utils/cn";
import { IoClose } from 'react-icons/io5';
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { BiErrorCircle } from "react-icons/bi";
import { IoInformationCircle } from "react-icons/io5";
import { alertVariants } from './variants';
import { CustomAlertProps } from './types';



const icons = {
    success: IoMdCheckmarkCircle,
    warning: IoWarning,
    error: BiErrorCircle,
    info: IoInformationCircle,
    default: IoInformationCircle,
};



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