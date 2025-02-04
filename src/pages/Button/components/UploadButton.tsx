import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const uploadButtonVariants = cva(
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

interface UploadButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof uploadButtonVariants> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  showProgress?: boolean;
  showPreview?: boolean;
  showFileInfo?: boolean;
  dragAndDrop?: boolean;
  onChange?: (files: File[]) => void;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (files: File[]) => void;
  onUploadError?: (error: Error) => void;
}

const UploadButton = React.forwardRef<HTMLButtonElement, UploadButtonProps>(
  (
    {
      className,
      variant,
      size,
      accept,
      multiple = false,
      maxSize,
      showProgress = true,
      showPreview = true,
      showFileInfo = true,
      dragAndDrop = true,
      onChange,
      onUploadStart,
      onUploadProgress,
      onUploadComplete,
      onUploadError,
      children,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [dragOver, setDragOver] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return;

      const validFiles = Array.from(newFiles).filter((file) => {
        if (maxSize && file.size > maxSize) {
          onUploadError?.(
            new Error(`File ${file.name} exceeds maximum size of ${formatBytes(maxSize)}`)
          );
          return false;
        }
        return true;
      });

      if (multiple) {
        setFiles((prev) => [...prev, ...validFiles]);
      } else {
        setFiles(validFiles.slice(0, 1));
      }

      onChange?.(validFiles);
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
    };

    const simulateUpload = async () => {
      try {
        setUploading(true);
        setProgress(0);
        onUploadStart?.();

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setProgress(i);
          onUploadProgress?.(i);
        }

        setUploading(false);
        onUploadComplete?.(files);
      } catch (error) {
        setUploading(false);
        onUploadError?.(error as Error);
      }
    };

    const removeFile = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div
        className={cn('flex flex-col gap-4', dragAndDrop && 'relative', dragOver && 'opacity-50')}
        onDrop={dragAndDrop ? handleDrop : undefined}
        onDragOver={dragAndDrop ? handleDragOver : undefined}
        onDragLeave={dragAndDrop ? handleDragLeave : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); }}
        />

        <button
          ref={ref}
          type="button"
          className={cn(uploadButtonVariants({ variant, size }), 'gap-2', className)}
          onClick={files.length > 0 ? simulateUpload : handleClick}
          disabled={uploading}
          {...props}
        >
          {uploading ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading... {progress}%
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
              </svg>
              {children || (files.length > 0 ? 'Upload Files' : 'Choose Files')}
            </>
          )}
        </button>

        {showProgress && uploading && (
          <div className="flex w-full items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-md border p-2"
              >
                {showPreview && file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  {showFileInfo && (
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  )}
                </div>
                <button
                  type="button"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => { removeFile(index); }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {dragAndDrop && dragOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed border-primary bg-background/50">
            <p className="text-sm font-medium">Drop files here</p>
          </div>
        )}
      </div>
    );
  }
);

UploadButton.displayName = 'UploadButton';

export { UploadButton };
