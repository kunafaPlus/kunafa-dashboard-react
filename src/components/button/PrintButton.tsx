import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { PrintButtonProps } from "./types";

const PrintButton = React.forwardRef<HTMLButtonElement, PrintButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    content,
    printOptions,
    showIcon = true,
    onBeforePrint,
    onAfterPrint,
    children,
    ...props 
  }, ref) => {
    const handlePrint = async () => {
      try {
        onBeforePrint?.();

        if (content) {
          // Create a new window for custom content
          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            throw new Error('Failed to open print window');
          }

          // Write the content to the new window
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Print</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style>
                  @media print {
                    body {
                      margin: 0;
                      padding: 16px;
                    }
                    @page {
                      margin: ${printOptions?.margin || '1cm'};
                      size: ${printOptions?.pageSize || 'auto'};
                    }
                  }
                </style>
              </head>
              <body>
                ${content}
              </body>
            </html>
          `);

          // Wait for content to load
          printWindow.document.close();
          await new Promise(resolve => setTimeout(resolve, 250));

          // Print and close
          printWindow.print();
          printWindow.close();
        } else {
          // Print current window
          window.print();
        }

        onAfterPrint?.();
      } catch (error) {
        console.error('Print failed:', error);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handlePrint}
        className={cn(
          buttonVariants({ variant, size }),
          "inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        {showIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

PrintButton.displayName = "PrintButton";

export { PrintButton };
