import * as React from "react";
import { cn } from "../../utils/cn";
import { RichTextEditorProps } from "./types/type";
import { richTextEditorVariants } from "./variants";




const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      className,
      variant,
      size,
      value: controlledValue,
      defaultValue = "",
      onChange,
      onImageUpload,
      placeholder = "Type your content here...",
      readOnly = false,
      error = false,
      label,
      toolbar = ["bold", "italic", "underline", "link", "image", "list", "heading"],
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(defaultValue);
    const editorRef = React.useRef<HTMLDivElement>(null);
    const currentValue = controlledValue ?? value;

    const execCommand = (command: string, value:any = null) => {
      document.execCommand(command, false, value);
      const newValue = editorRef.current?.innerHTML || "";
      setValue(newValue);
      onChange?.({ target: { value: newValue } } as any); };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCommand("bold");
      } else if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCommand("italic");
      } else if (e.key === "u" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCommand("underline");
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      execCommand("insertText", text);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !onImageUpload) return;

      try {
        const url = await onImageUpload(file);
        execCommand("insertImage", url);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    };

    const handleLink = () => {
      const url = window.prompt("Enter URL:");
      if (url) {
        execCommand("createLink", url);
      }
    };

    return (
      <div
        className={cn(
          richTextEditorVariants({ variant, size } as{}),
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {label&&<p>{label}</p>}
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2 border-b p-2">
            {toolbar.includes("bold") && (
              <button
                type="button"
                onClick={() => execCommand("bold")}
                className="p-1 hover:bg-accent rounded"
              >
                B
              </button>
            )}
            {toolbar.includes("italic") && (
              <button
                type="button"
                onClick={() => execCommand("italic")}
                className="p-1 hover:bg-accent rounded italic"
              >
                I
              </button>
            )}
            {toolbar.includes("underline") && (
              <button
                type="button"
                onClick={() => execCommand("underline")}
                className="p-1 hover:bg-accent rounded underline"
              >
                U
              </button>
            )}
            {toolbar.includes("link") && (
              <button
                type="button"
                onClick={handleLink}
                className="p-1 hover:bg-accent rounded"
              >
                🔗
              </button>
            )}
            {toolbar.includes("image") && onImageUpload && (
              <label className="cursor-pointer p-1 hover:bg-accent rounded">
                📷
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
            {toolbar.includes("list") && (
              <button
                type="button"
                onClick={() => execCommand("insertUnorderedList")}
                className="p-1 hover:bg-accent rounded"
              >
                •
              </button>
            )}
            {toolbar.includes("heading") && (
              <select
                onChange={(e) => execCommand("formatBlock", e.target.value)}
                className="p-1 bg-transparent hover:bg-accent rounded"
              >
                <option value="p">Normal</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            )}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable={!readOnly}
          dangerouslySetInnerHTML={{ __html: currentValue }}
          onInput={(e) => {
            const newValue = e.currentTarget.innerHTML;
            setValue(newValue);
            onChange?.({ target: { value: newValue } }as any); // Call onChange with the correct structure
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            "p-4 outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground",
            readOnly && "cursor-default"
          )}
          data-placeholder={placeholder}
        />
        {error&&<p className="text-red-500 -mt-2">{error}</p>}

      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor, richTextEditorVariants };