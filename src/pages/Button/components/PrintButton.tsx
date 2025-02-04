import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const printButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface PrintOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  scale?: number;
  margins?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  showBackground?: boolean;
  printImages?: boolean;
  pageRanges?: string;
  copies?: number;
  headerTemplate?: string;
  footerTemplate?: string;
}

interface PrintButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof printButtonVariants> {
  elementToPrint?: React.RefObject<HTMLElement>;
  options?: PrintOptions;
  showDialog?: boolean;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

const PrintButton = React.forwardRef<HTMLButtonElement, PrintButtonProps>(
  (
    {
      className,
      variant,
      size,
      elementToPrint,
      options = {},
      showDialog = true,
      onBeforePrint,
      onAfterPrint,
      children,
      ...props
    },
    ref
  ) => {
    const [printing, setPrinting] = React.useState(false);
    const [showOptions, setShowOptions] = React.useState(false);
    const [printOptions, setPrintOptions] = React.useState<PrintOptions>(options);

    const print = async () => {
      try {
        setPrinting(true);
        onBeforePrint?.();

        if (elementToPrint?.current) {
          const content = elementToPrint.current.innerHTML;
          const printWindow = window.open('', '_blank');
          if (!printWindow) throw new Error('Failed to open print window');

          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${printOptions.title || document.title}</title>
                <style>
                  @page {
                    size: ${printOptions.orientation || 'portrait'};
                    margin: ${printOptions.margins?.top || '1cm'} ${
                      printOptions.margins?.right || '1cm'
                    } ${printOptions.margins?.bottom || '1cm'} ${
                      printOptions.margins?.left || '1cm'
                    };
                  }
                  @media print {
                    body {
                      -webkit-print-color-adjust: exact;
                      print-color-adjust: exact;
                    }
                  }
                </style>
              </head>
              <body>
                ${content}
                <script>
                  window.onload = () => {
                    window.print();
                    window.onafterprint = () => window.close();
                  }
                </script>
              </body>
            </html>
          `);

          printWindow.document.close();
        } else {
          if (showDialog) {
            window.print();
          } else {
            const printSettings = {
              ...printOptions,
              scale: printOptions.scale || 1,
              printBackground: printOptions.showBackground || true,
              shouldPrintBackgrounds: printOptions.showBackground || true,
              preferCSSPageSize: true,
            };

            // Use browser's print API with settings
            window.print();
          }
        }

        onAfterPrint?.();
      } catch (error) {
        console.error('Print error:', error);
      } finally {
        setPrinting(false);
      }
    };

    const handlePrint = () => {
      if (showDialog) {
        setShowOptions(true);
      } else {
        print();
      }
    };

    return (
      <>
        <button
          ref={ref}
          type="button"
          className={cn(printButtonVariants({ variant, size }), 'gap-2', className)}
          onClick={handlePrint}
          disabled={printing}
          {...props}
        >
          {printing ? (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
            </svg>
          )}
          {children || (printing ? 'Printing...' : 'Print')}
        </button>

        {showOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Print Options</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Orientation
                    <select
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                      value={printOptions.orientation || 'portrait'}
                      onChange={(e) =>
                        { setPrintOptions((prev) => ({
                          ...prev,
                          orientation: e.target.value as 'portrait' | 'landscape',
                        })); }
                      }
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Scale
                    <input
                      type="number"
                      min={0.1}
                      max={2}
                      step={0.1}
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                      value={printOptions.scale || 1}
                      onChange={(e) =>
                        { setPrintOptions((prev) => ({
                          ...prev,
                          scale: parseFloat(e.target.value),
                        })); }
                      }
                    />
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={printOptions.showBackground || false}
                      onChange={(e) =>
                        { setPrintOptions((prev) => ({
                          ...prev,
                          showBackground: e.target.checked,
                        })); }
                      }
                    />
                    Show Background
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Page Ranges (e.g., 1-5, 8, 11-13)
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                      value={printOptions.pageRanges || ''}
                      onChange={(e) =>
                        { setPrintOptions((prev) => ({
                          ...prev,
                          pageRanges: e.target.value,
                        })); }
                      }
                    />
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Copies
                    <input
                      type="number"
                      min={1}
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                      value={printOptions.copies || 1}
                      onChange={(e) =>
                        { setPrintOptions((prev) => ({
                          ...prev,
                          copies: parseInt(e.target.value),
                        })); }
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className={cn(printButtonVariants({ variant: 'outline' }))}
                  onClick={() => { setShowOptions(false); }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={cn(printButtonVariants({ variant: 'default' }))}
                  onClick={() => {
                    setShowOptions(false);
                    print();
                  }}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

PrintButton.displayName = 'PrintButton';

export { PrintButton };
