import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { Editor } from '@tinymce/tinymce-react';

const richTextInputVariants = cva(
  "w-full min-h-[16rem]",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface RichTextInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof richTextInputVariants> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  minHeight?: number;
  maxHeight?: number;
  toolbar?: string[];
  plugins?: string[];
  menubar?: boolean | string;
  statusbar?: boolean;
  readonly?: boolean;
  uploadHandler?: (blobInfo: any) => Promise<string>;
  onImageUploadError?: (error: any) => void;
}

const DEFAULT_TOOLBAR = [
  "undo redo | formatselect | bold italic underline strikethrough | ",
  "alignleft aligncenter alignright alignjustify | ",
  "bullist numlist outdent indent | removeformat | help"
];

const DEFAULT_PLUGINS = [
  "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
  "searchreplace", "visualblocks", "code", "fullscreen",
  "insertdatetime", "media", "table", "code", "help", "wordcount"
];

const RichTextInput = React.forwardRef<HTMLDivElement, RichTextInputProps>(
  (
    {
      className,
      variant,
      size,
      value = "",
      onChange,
      placeholder = "Start typing...",
      disabled = false,
      error,
      hint,
      minHeight = 400,
      maxHeight = 800,
      toolbar = DEFAULT_TOOLBAR,
      plugins = DEFAULT_PLUGINS,
      menubar = true,
      statusbar = true,
      readonly = false,
      uploadHandler,
      onImageUploadError,
      ...props
    },
    ref
  ) => {
    const editorRef = React.useRef<any>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const handleInit = (evt: any, editor: any) => {
      editorRef.current = editor;
    };

    const handleEditorChange = (content: string) => {
      onChange?.(content);
    };

    const imageUploadHandler = async (blobInfo: any, progress: Function): Promise<string> => {
      try {
        if (uploadHandler) {
          return await uploadHandler(blobInfo);
        }
        // Default handler converts image to base64
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(blobInfo.blob());
        });
      } catch (error) {
        onImageUploadError?.(error);
        throw error;
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn(richTextInputVariants({ variant, size }), className)}
        {...props}
      >
        <Editor
          apiKey={"your-default-api-key"} // Provide a default API key
          onInit={handleInit}
          value={value}
          onEditorChange={handleEditorChange}
          init={{
            height: minHeight,
            min_height: minHeight,
            max_height: maxHeight,
            menubar,
            plugins,
            toolbar: toolbar.join(" "),
            statusbar,
            
            placeholder,
            skin: "oxide",
            content_css: "default",
            browser_spellcheck: true,
            contextmenu: false,
            images_upload_handler: imageUploadHandler,
            paste_data_images: true,
            automatic_uploads: true,
            file_picker_types: "image",
            promotion: false,
            branding: false,
            resize: true,
            elementpath: false,
            content_style: `
              body {
                font-family: system-ui, -apple-system, sans-serif;
                font-size: ${size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem"};
                line-height: 1.5;
                margin: 1rem;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            `,
          }}
          disabled={disabled}
        />

        {(error || hint) && (
          <div
            className={cn(
              "mt-1 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

RichTextInput.displayName = "RichTextInput";

export { RichTextInput };
