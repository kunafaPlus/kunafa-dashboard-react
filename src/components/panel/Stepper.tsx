'use client'
import { ReactNode, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { IoCheckmark } from "react-icons/io5"
import CustomButton from '../button/CustomButton'
import { StepperProps } from './types'
import { stepperVariants } from './variants'



export function Stepper({
    steps,
    activeStep,
    className,
    variant,
    size,
    onChange,
    children,
    ...props
}: StepperProps) {
    const [currentStep, setCurrentStep] = useState(activeStep)
    const isVertical = variant === 'vertical'

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
            onChange?.(currentStep + 1)
        }
    }

    const handleStepClick = (index: number) => {
        if (onChange && !steps[index].completed) {
            setCurrentStep(index)
            onChange(index)
        }
    }

    return (
        <div className="space-y-6">
            <div
                className={cn(
                    stepperVariants({ variant, size }),
                    className
                )}
                {...props}
            >
                {steps.map((step, index) => {
                    const isActive = currentStep === index
                    const isCompleted = index < currentStep || step.completed
                    const isLast = index === steps.length - 1
                    const isClickable = onChange && !step.completed

                    return (
                        <div
                            key={index}
                            className={cn(
                                "relative flex",
                                isVertical ? "flex-row" : "flex-col items-center"
                            )}
                        >
                            {/* Connector Line */}
                            {!isLast && (
                                <div
                                    className={cn(
                                        "absolute bg-gray-200",
                                        isVertical
                                            ? "left-5 top-12 h-full w-[2px]"
                                            : "left-[50%] top-5 h-[2px] w-full",
                                        isCompleted && "bg-primary"
                                    )}
                                />
                            )}

                            {/* Step Content */}
                            <div className={cn(
                                "relative flex",
                                isVertical ? "items-start space-x-4" : "flex-col items-center"
                            )}>
                                {/* Step Circle */}
                                <button
                                    onClick={() => handleStepClick(index)}
                                    className={cn(
                                        "relative flex items-center justify-center rounded-full border-2 transition-colors",
                                        isCompleted
                                            ? "border-primary bg-primary text-white"
                                            : isActive
                                                ? "border-primary bg-white text-primary"
                                                : "border-gray-300 bg-white",
                                        isClickable && "cursor-pointer hover:bg-gray-50",
                                        !isClickable && "cursor-default"
                                    )}
                                >
                                    {isCompleted ? (
                                        <IoCheckmark className="h-5 w-5" />
                                    ) : (
                                        step.icon || (index + 1)
                                    )}
                                </button>

                                {/* Step Text */}
                                <div className={cn(
                                    "mt-2 text-center",
                                    isVertical && "mt-0 text-right"
                                )}>
                                    <div className="flex items-center gap-1">
                                        <span className={cn(
                                            "font-medium",
                                            isActive && "text-primary",
                                            !isActive && !isCompleted && "text-gray-500"
                                        )}>
                                            {step.title}
                                        </span>
                                        {step.optional && (
                                            <span className="text-sm text-gray-500">(اختياري)</span>
                                        )}
                                    </div>
                                    {step.description && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Step Content */}
            <div className="p-4 bg-gray-50 rounded-lg">
                {steps[currentStep]?.content || children}
            </div>

            {/* Next Button */}
            {currentStep < steps.length - 1 && (
                <div className="flex justify-end">
                    <CustomButton onClick={handleNext}>
                        التالي
                    </CustomButton>
                </div>
            )}
        </div>
    )
}