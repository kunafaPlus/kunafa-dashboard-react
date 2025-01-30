import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FileDropzoneProps, FileWithPreview } from "../utils/type";
import { cn } from "../../../utils/cn";

const fileDropzoneVariants = cva(
  "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors",
  {
    variants: {
      variant: {
        default: "border-muted-foreground/25 hover:border-muted-foreground/50",
        filled: "bg-muted border-transparent hover:border-primary",
        ghost: "border-transparent hover:border-primary",
      },
      size: {
        sm: "p-4 min-h-[100px]",
        md: "p-6 min-h-[150px]",
        lg: "p-8 min-h-[200px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);




const FileDropzone = React.forwardRef<HTMLDivElement, FileDropzoneProps>(
  (
    {
      className,
      variant,
      size,
      value = [],
      onChange,
      onError,
      accept,
      maxFiles = Infinity,
      maxSize = Infinity,
      minSize = 0,
      disabled = false,
      error,
      hint,
      preview = true,
      previewMaxHeight = 200,
      showFileList = true,
      renderPreview,
      validateFile,
      onDragEnter,
      onDragLeave,
      onDrop,
      children,
      label,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [internalFiles, setInternalFiles] = React.useState<FileWithPreview[]>(
      Array.isArray(value) ? value.map(file => ({
        ...file,
        preview: preview && file.type && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
      })) : []
    );

    React.useImperativeHandle(ref, () => containerRef.current!);

    // Update internal files when the value changes from outside
    React.useEffect(() => {
      if (Array.isArray(value)) {
        setInternalFiles(value.map(file => ({
          ...file,
          preview: preview && file.type && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
        })));
      }
    }, [value, preview]);

    // Clean up object URLs on component unmount
    React.useEffect(() => {
      return () => {
        internalFiles.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
      };
    }, [internalFiles]);

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
      onDragEnter?.(e);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(false);
      onDragLeave?.(e);
    };

    const validateFiles = (files: File[]): FileWithPreview[] => {
      const validFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      for (const file of files) {
        if (!(file instanceof File)) {
          errors.push(`Invalid file object: ${file}`);
          continue;
        }

        // Check file type
        const fileType = file.type || "";
        const fileExtension = file.name.split(".").pop() || "";
        const isValidType =
          accept === "*" ||
          accept === `.${fileExtension}` ||
          (typeof accept === 'string' && accept.endsWith("/*") &&
            fileType.startsWith(accept.replace("/*", ""))) ||
          (Array.isArray(accept) &&
            accept.some(
              (type) =>
                type === fileType ||
                type === `.${fileExtension}` ||
                (type.endsWith("/*") &&
                  fileType.startsWith(type.replace("/*", "")))
            ));

        if (!isValidType) {
          errors.push(`Invalid file type: ${file.name}`);
          continue;
        }

        // Check file size
        if (file.size > maxSize) {
          errors.push(`File too large: ${file.name}`);
          continue;
        }

        if (file.size < minSize) {
          errors.push(`File too small: ${file.name}`);
          continue;
        }

        // Custom validation
        if (validateFile) {
          const validationResult = validateFile(file);
          if (validationResult !== true) {
            errors.push(
              typeof validationResult === "string"
                ? validationResult
                : `Invalid file: ${file.name}`
            );
            continue;
          }
        }

        validFiles.push(file);
      }

      if (errors.length > 0) {
        onError?.(errors.join("\n"));
      }

      return validFiles;
    };

    const addFiles = (files: FileList | File[]) => {
      if (disabled) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxFiles - internalFiles.length;
      const filesToProcess = fileArray.slice(0, remainingSlots);

      const validFiles = validateFiles(filesToProcess);
      if (validFiles.length === 0) return;

      const newFiles = validFiles.map((file) => ({
        ...file,
        preview: preview && file.type && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
      }));

      const updatedFiles = [...internalFiles, ...newFiles];
      setInternalFiles(updatedFiles);

      if (onChange) {
        onChange({
          target: {
            value: updatedFiles
          }
        });
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(false);
      onDrop?.(e);

      const { files } = e.dataTransfer;
      addFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files) {
        addFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    };

    const removeFile = (fileToRemove: FileWithPreview) => {
      if (disabled) return;

      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const newFiles = internalFiles.filter(file => file !== fileToRemove);
      setInternalFiles(newFiles);

      if (onChange) {
        onChange({
          target: {
            value: newFiles
          }
        });
      }
    };

    const defaultRenderPreview = (file: FileWithPreview) => {
      if (!file) {
        return <div>ملف غير صالح</div>; // رسالة خطأ إذا كان الملف غير موجود
      }
    
      // إذا كان الملف من نوع صورة
      if (file.type && file.type.startsWith("image/") && file.preview) {
        return (
          <div className="relative">
            <img
              src={file.preview}
              alt={file.name}
              className="max-w-full object-contain rounded"
              style={{ maxHeight: previewMaxHeight }}
            />
            <button
              type="button"
              className="absolute top-2 right-2 p-1 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full"
              onClick={() => removeFile(file)}
              disabled={disabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        );
      }
    
      // إذا كان الملف ليس صورة، عرض اسم الملف
      return (
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <span className="text-sm truncate">{file.name}</span>
          <button
            type="button"
            className="ml-2 text-destructive"
            onClick={() => removeFile(file)}
            disabled={disabled}
          >
            حذف
          </button>
        </div>
      );
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div
          ref={containerRef}
          className={cn(
            fileDropzoneVariants({ variant, size }),
            isDragging && "border-primary bg-primary/10",
            disabled && "opacity-50 cursor-not-allowed",
            error ? "border-red-500" : "border-gray-300",
            "hover:border-gray-400",
            className
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          {...props}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            onChange={handleFileInput}
            accept={typeof accept === 'string' ? accept : accept?.join(',')}
            multiple={maxFiles !== 1}
            disabled={disabled || internalFiles.length >= maxFiles}
          />
    
          {internalFiles.length > 0 ? (
            <div className="w-full h-full flex flex-col">
              {internalFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded mb-2">
                  <span className="text-sm truncate">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                  <button
                    type="button"
                    className="text-destructive"
                    onClick={() => removeFile(file)}
                    disabled={disabled}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          ) : (
            children || (
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto w-12 h-12 text-muted-foreground mb-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
    
                <div className="text-muted-foreground">
                  <button
                    type="button"
                    className="text-primary hover:underline disabled:no-underline disabled:opacity-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || internalFiles.length >= maxFiles}
                  >
                    Click to upload
                  </button>{" "}
                  or drag and drop
                </div>
    
                <div className="mt-2 text-sm text-muted-foreground">
                  {typeof accept === 'string'
                    ? "Any file format"
                    : accept?.join(", ").toUpperCase()}
                  {maxSize !== Infinity &&
                    ` up to ${(maxSize / 1024 / 1024).toFixed(0)} MB`}
                </div>
              </div>
            )
          )}
        </div>
    
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileDropzone.displayName = "FileDropzone";

export { FileDropzone, type FileWithPreview };