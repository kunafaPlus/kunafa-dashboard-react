'use client'
import { ReactNode, useEffect, useRef } from 'react'
import { IoClose } from "react-icons/io5";
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { IconButton } from '../button/IconButton';
import { CustomDialogProps } from './types';
import { dialogVariants } from './variants';





export default function CustomDialog({
    isOpen,
    onClose,
    title,
    children,
    description,
    showCloseButton = true,
    actions,
    size,
    variant,
    rounded,
    className
}: CustomDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        // إضافة مستمع لمفتاح Escape
        document.addEventListener('keydown', handleEscape);

        // تعطيل التمرير في الخلفية عندما يكون الحوار مفتوحاً
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            // تحريك ظهور الحوار
            if (dialogRef.current) {
                dialogRef.current.style.opacity = '0';
                dialogRef.current.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (dialogRef.current) {
                        dialogRef.current.style.opacity = '1';
                        dialogRef.current.style.transform = 'scale(1)';
                    }
                }, 10);
            }
            // تحريك ظهور الخلفية
            if (overlayRef.current) {
                overlayRef.current.style.opacity = '0';
                setTimeout(() => {
                    if (overlayRef.current) {
                        overlayRef.current.style.opacity = '1';
                    }
                }, 10);
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* الخلفية المعتمة */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/25 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* محاذاة الحوار في المنتصف */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* الحوار */}
                <div
                    ref={dialogRef}
                    className={cn(
                        dialogVariants({ size, variant, rounded }),
                        "transition-all duration-300",
                        className
                    )}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* رأس الحوار */}
                    <div className="flex justify-between items-start p-6 pb-0">
                        <div>
                            {title && (
                                <h3 className="text-lg font-medium text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="mt-2 text-sm text-gray-500">
                                    {description}
                                </p>
                            )}
                        </div>
                        {showCloseButton && (
                            <IconButton
                                icon={<IoClose size={28}/>}
                                variant='ghost'
                                onClick={onClose}
                            />
                        )}
                    </div>

                    {/* محتوى الحوار */}
                    <div className="p-6">
                        {children}
                    </div>

                    {/* أزرار الإجراءات */}
                    {actions && (
                        <div className="flex justify-end gap-3 px-6 pb-6">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
