import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const voiceCommandButtonVariants = cva(
  'group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      state: {
        idle: '',
        listening:
          'before:absolute before:inset-0 before:rounded-[inherit] before:border-4 before:border-current before:opacity-20 before:animate-ping',
        processing:
          'after:absolute after:inset-[3px] after:rounded-full after:border-2 after:border-current after:border-r-transparent after:animate-spin',
        success: 'bg-green-500 text-white hover:bg-green-600',
        error: 'bg-red-500 text-white hover:bg-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'idle',
    },
  }
);

interface VoiceCommandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof voiceCommandButtonVariants> {
  onCommand?: (command: string) => void;
  commands?: string[];
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  recognitionTimeout?: number;
  icon?: React.ReactNode;
  listeningIcon?: React.ReactNode;
  processingIcon?: React.ReactNode;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
}

const VoiceCommandButton = React.forwardRef<HTMLButtonElement, VoiceCommandButtonProps>(
  (
    {
      className,
      variant,
      size,
      state,
      onCommand,
      commands = [],
      language = 'en-US',
      continuous = false,
      interimResults = true,
      maxAlternatives = 1,
      recognitionTimeout = 5000,
      icon,
      listeningIcon,
      processingIcon,
      successIcon,
      errorIcon,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [currentState, setCurrentState] = React.useState<
      'idle' | 'listening' | 'processing' | 'success' | 'error'
    >('idle');
    const [recognition, setRecognition] = React.useState<SpeechRecognition | null>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
      if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
        const SpeechRecognition =
          window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = maxAlternatives;
        recognition.lang = language;

        recognition.onstart = () => {
          setCurrentState('listening');
          timeoutRef.current = setTimeout(() => {
            recognition.stop();
            setCurrentState('error');
          }, recognitionTimeout);
        };

        recognition.onresult = (event) => {
          const last = event.results.length - 1;
          const command = event.results[last][0].transcript.trim().toLowerCase();

          if (commands.length === 0 || commands.includes(command)) {
            setCurrentState('success');
            onCommand?.(command);
          } else {
            setCurrentState('error');
          }
        };

        recognition.onerror = () => {
          setCurrentState('error');
        };

        recognition.onend = () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          if (currentState === 'listening') {
            setCurrentState('idle');
          }
        };

        setRecognition(recognition);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [
      commands,
      continuous,
      interimResults,
      language,
      maxAlternatives,
      onCommand,
      recognitionTimeout,
    ]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (recognition) {
        if (currentState === 'idle') {
          recognition.start();
        } else if (currentState === 'listening') {
          recognition.stop();
        }
      }
      onClick?.(e);
    };

    const getIcon = () => {
      switch (currentState) {
        case 'listening':
          return (
            listeningIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )
          );
        case 'processing':
          return (
            processingIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )
          );
        case 'success':
          return (
            successIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )
          );
        case 'error':
          return (
            errorIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )
          );
        default:
          return (
            icon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )
          );
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          voiceCommandButtonVariants({ variant, size, state: currentState }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {getIcon()}
        {children && <span className="ml-2">{children}</span>}
      </button>
    );
  }
);

VoiceCommandButton.displayName = 'VoiceCommandButton';

export { VoiceCommandButton };
