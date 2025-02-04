import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const downloadButtonVariants = cva(
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

interface DownloadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof downloadButtonVariants> {
  url: string;
  filename?: string;
  showProgress?: boolean;
  showSize?: boolean;
  showIcon?: boolean;
  onDownloadStart?: () => void;
  onDownloadProgress?: (progress: number) => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
}

const DownloadButton = React.forwardRef<HTMLButtonElement, DownloadButtonProps>(
  (
    {
      className,
      variant,
      size,
      url,
      filename,
      showProgress = true,
      showSize = true,
      showIcon = true,
      onDownloadStart,
      onDownloadProgress,
      onDownloadComplete,
      onDownloadError,
      children,
      ...props
    },
    ref
  ) => {
    const [downloading, setDownloading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [fileSize, setFileSize] = React.useState<number | null>(null);

    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const download = async () => {
      try {
        setDownloading(true);
        setProgress(0);
        onDownloadStart?.();

        const response = await fetch(url);
        if (!response.ok) throw new Error('Download failed');

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        setFileSize(total);

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Failed to get reader');

        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          const currentProgress = (receivedLength / total) * 100;
          setProgress(currentProgress);
          onDownloadProgress?.(currentProgress);
        }

        const blob = new Blob(chunks);
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename || url.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        setDownloading(false);
        setProgress(100);
        onDownloadComplete?.();
      } catch (error) {
        setDownloading(false);
        onDownloadError?.(error as Error);
      }
    };

    return (
      <div className="inline-flex flex-col gap-2">
        <button
          ref={ref}
          type="button"
          className={cn(downloadButtonVariants({ variant, size }), 'gap-2', className)}
          onClick={download}
          disabled={downloading}
          {...props}
        >
          {showIcon && (
            <span className="inline-flex">
              {downloading ? (
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
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                </svg>
              )}
            </span>
          )}
          {children || (downloading ? `Downloading... ${progress.toFixed(0)}%` : 'Download')}
        </button>

        {showProgress && downloading && (
          <div className="flex w-full items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {showSize && fileSize && (
              <span className="text-xs text-muted-foreground">{formatBytes(fileSize)}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

DownloadButton.displayName = 'DownloadButton';

export { DownloadButton };
