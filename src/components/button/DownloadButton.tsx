import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { DownloadButtonProps } from "./types/index";

const DownloadButton = React.forwardRef<HTMLButtonElement, DownloadButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default",
    url,
    filename,
    onDownloadStart,
    onDownloadProgress,
    onDownloadComplete,
    onError,
    children,
    ...props 
  }, ref) => {
    const [isDownloading, setIsDownloading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const downloadFile = async () => {
      try {
        setIsDownloading(true);
        onDownloadStart?.();

        const response = await fetch(url);
        if (!response.ok) throw new Error('Download failed');

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Failed to start download');

        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          loaded += value.length;

          if (total) {
            const currentProgress = Math.round((loaded / total) * 100);
            setProgress(currentProgress);
            onDownloadProgress?.(currentProgress);
          }
        }

        const blob = new Blob(chunks);
        const downloadUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        onDownloadComplete?.();
      } catch (error) {
        console.error('Download error:', error);
        onError?.(error instanceof Error ? error.message : 'Download failed');
      } finally {
        setIsDownloading(false);
        setProgress(0);
      }
    };

    return (
      <button
        ref={ref}
        onClick={downloadFile}
        disabled={isDownloading}
        className={cn(
          buttonVariants({ variant, size }),
          "relative inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        {isDownloading ? (
          <>
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {progress > 0 && `${progress}%`}
          </>
        ) : (
          <>
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {children || "Download"}
          </>
        )}
      </button>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

export { DownloadButton };
