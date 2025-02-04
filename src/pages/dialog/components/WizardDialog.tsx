import * as React from 'react';
import { BiCheck, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FaX } from 'react-icons/fa6';

import { cn } from '../../../utils/cn';


interface WizardStep {
  title: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface WizardDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  steps: WizardStep[];
  title?: string;
  description?: string;
  finishLabel?: string;
  cancelLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  onFinish?: (currentStep: number) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  preventClose?: boolean;
  showStepIndicator?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const WizardDialog = React.forwardRef<HTMLDivElement, WizardDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      steps = [],
      title = 'Wizard',
      description,
      finishLabel = 'Finish',
      cancelLabel = 'Cancel',
      nextLabel = 'Next',
      backLabel = 'Back',
      onFinish,
      onCancel,
      loading = false,
      preventClose = false,
      showStepIndicator = true,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [stepStates, setStepStates] = React.useState<
      Array<'incomplete' | 'current' | 'complete'>
    >(() => steps.map((_, index) => (index === 0 ? 'current' : 'incomplete')));

    if (!open || steps.length === 0) return null;

    const getMaxWidth = () => {
      switch (size) {
        case 'sm':
          return 'max-w-sm';
        case 'md':
          return 'max-w-md';
        case 'lg':
          return 'max-w-lg';
        case 'xl':
          return 'max-w-xl';
        case 'full':
          return 'max-w-[calc(100%-2rem)]';
        default:
          return 'max-w-md';
      }
    };

    const handleClose = () => {
      // if (preventClose) return;
      // onOpenChange?.(false);
      onCancel?.();
      // Reset state
      setCurrentStep(0);
      setStepStates(steps.map((_, index) => (index === 0 ? 'current' : 'incomplete')));
    };

    const handleNext = async () => {
      const currentStepData = steps[currentStep];

      if (currentStepData.validate) {
        const isValid = await currentStepData.validate();
        if (!isValid) return;
      }

      if (currentStep === steps.length - 1) {
        await onFinish?.(currentStep);
        handleClose();
        return;
      }

      setStepStates((prev) =>
        prev.map((state, index) => {
          if (index === currentStep) return 'complete';
          if (index === currentStep + 1) return 'current';
          return state;
        })
      );
      setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
      if (currentStep === 0) return;

      setStepStates((prev) =>
        prev.map((state, index) => {
          if (index === currentStep) return 'incomplete';
          if (index === currentStep - 1) return 'current';
          return state;
        })
      );
      setCurrentStep((prev) => prev - 1);
    };

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" {...props}>
        <div
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-background shadow-lg duration-200 sm:rounded-lg',
            getMaxWidth(),
            className
          )}
          ref={ref}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{title}</h2>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {!preventClose && (
              <button
                type="button"
                onClick={handleClose}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              >
                <FaX className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>

          {/* Step Indicator */}
          {showStepIndicator && (
            <div className="px-6">
              <div className="relative flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                        stepStates[index] === 'complete'
                          ? 'border-primary bg-primary text-white'
                          : stepStates[index] === 'current'
                            ? 'border-primary text-primary'
                            : 'border-muted text-muted-foreground'
                      )}
                    >
                      {stepStates[index] === 'complete' ? (
                        <BiCheck className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'h-0.5 flex-1',
                          stepStates[index] === 'complete' ? 'bg-primary' : 'bg-muted'
                        )}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-2 flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      'text-sm',
                      stepStates[index] === 'current'
                        ? 'font-medium text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 pt-0">{steps[currentStep].content}</div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t p-6">
            <button
              type="button"
              onClick={handleBack}
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
                currentStep === 0 && 'invisible'
              )}
              disabled={currentStep === 0 || loading}
            >
              <BiChevronLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              disabled={loading}
            >
              {loading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : null}
              {currentStep === steps.length - 1 ? finishLabel : nextLabel}
              {currentStep < steps.length - 1 && <BiChevronRight className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

WizardDialog.displayName = 'WizardDialog';

export { WizardDialog, type WizardDialogProps, type WizardStep };
