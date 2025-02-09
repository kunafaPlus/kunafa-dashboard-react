import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FileUploaderProps } from "./types/type";
import { cn } from "../../utils/cn";
import { fileUploaderVariants } from "./variants";




const FileUploader = React.forwardRef<HTMLDivElement, FileUploaderProps>(
  (
    {
      className,
      variant,
      size,
      accept,
      maxSize,
      maxFiles = 1,
      disabled = false,
      onFilesSelected,
      onError,
      preview = true,
      dragActiveContent,
      children,
      label,
      error,
      ...props
    },
    ref
  ) => {
    const [dragActive, setDragActive] = React.useState(false);
    const [files, setFiles] = React.useState<File[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
        } else if (e.type === "dragleave") {
          setDragActive(false);
        }
      },
      [disabled]
    );

    const validateFiles = (fileList: FileList): File[] => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach((file) => {
        if (accept && !file.type.match(accept)) {
          errors.push(`File type ${file.type} is not supported`);
          return;
        }

        if (maxSize && file.size > maxSize) {
          errors.push(`File ${file.name} is too large`);
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length + files.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return [];
      }

      errors.forEach((error) => onError?.(error));
      return validFiles;
    };

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        const validFiles = validateFiles(e.dataTransfer.files);
        if (validFiles.length) {
          setFiles((prev) => {
            const newFiles = [...prev, ...validFiles].slice(0, maxFiles);
            onFilesSelected?.(newFiles);
            return newFiles;
          });
        }
      },
      [disabled, maxFiles, onFilesSelected]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (disabled || !e.target.files) return;

      const validFiles = validateFiles(e.target.files);
      if (validFiles.length) {
        setFiles((prev) => {
          const newFiles = [...prev, ...validFiles].slice(0, maxFiles);
          onFilesSelected?.(newFiles);
          return newFiles;
        });
      }
    };

    const removeFile = (index: number) => {
      setFiles((prev) => {
        const newFiles = prev.filter((_, i) => i !== index);
        onFilesSelected?.(newFiles);
        return newFiles;
      });
    };

    const handleButtonClick = () => {
      inputRef.current?.click();
    };

    return (
      <div
        ref={ref}
        className={cn(
          fileUploaderVariants({ variant, size } as any),
          dragActive && "border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        {...props}
      >
             {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          {dragActive ? (
            dragActiveContent || (
              <div className="text-primary">Drop files here...</div>
            )
          ) : (
            <>
              {children || (
                <>
                  <div className="text-muted-foreground">
                    Drag & drop files here, or{" "}
                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="text-primary hover:underline focus:outline-none"
                      disabled={disabled}
                    >
                      browse
                    </button>
                  </div>
                  {accept && (
                    <div className="text-sm text-muted-foreground">
                      Accepted files: {accept}
                    </div>
                  )}
                  {maxSize && (
                    <div className="text-sm text-muted-foreground">
                      Max size: {(maxSize / 1024 / 1024).toFixed(2)}MB
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {preview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => {
              const fileURL = URL.createObjectURL(file); // Create a URL for the file
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-muted p-2"
                >
                  <div className="flex items-center space-x-2">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={fileURL}
                        alt={file.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="text-sm font-medium">{file.name}</div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      ({(file.size / 1024).toFixed(2)}KB)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove file"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {error&&<p className="text-red-500 -mt-2">{error}</p>}
      </div>
    );
  }
);

FileUploader.displayName = "FileUploader";

export { FileUploader, fileUploaderVariants };