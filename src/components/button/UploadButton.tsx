import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, uploadButtonVariants } from "./variants";
import { UploadButtonProps } from "./types";
import { BiUpload } from "react-icons/bi";

const UploadButton = React.forwardRef<HTMLDivElement, UploadButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      accept,
      multiple = false,
      maxSize,
      onFilesSelected,
      loading = false,
      icon = <BiUpload className="h-4 w-4" />,
      children,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleClick = () => {
      if (!loading && inputRef.current) {
        inputRef.current.click();
      }
    };

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!loading) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (!loading && e.dataTransfer.files?.length) {
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter(file => 
          (!maxSize || file.size <= maxSize) &&
          (!accept || accept.split(',').some(type => 
            file.type.match(new RegExp(type.trim().replace('*', '.*')))
          ))
        );
        
        if (validFiles.length) {
          onFilesSelected?.(multiple ? validFiles : [validFiles[0]]);
        }
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const files = Array.from(e.target.files);
        onFilesSelected?.(multiple ? files : [files[0]]);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          uploadButtonVariants({ isDragging, loading }),
          "relative",
          className
        )}
        onDragOver={(e) => {
          e.preventDefault(); // Prevent default to allow drop
          handleDragEnter(e);
        }}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        // onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        // {...props}
      > 
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={loading}
        />
        <div className="flex items-center gap-2">
          {icon}
          {children}
        </div>
      </div>
    );
  }
);

UploadButton.displayName = "UploadButton";

export { UploadButton };
