import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { jsonInputVariants } from "./variants";
import { JSONInputProps, JSONValue } from "./types/type";




const JSONInput = React.forwardRef<HTMLTextAreaElement, JSONInputProps>(
  (
    {
      className,
      variant,
      size,
      value = {},
      onChange,
      error,
      hint,
      formatOnBlur = true,
      validateOnChange = true,
      indentSize = 2,
      readOnly = false,
      schema,
      onValidationError,
      ...props
    },
    ref
  ) => {
    const [text, setText] = React.useState("");
    const [localError, setLocalError] = React.useState<string>("");

    // Convert JSON object to formatted string
    const formatJSON = (obj: JSONValue): string => {
      try {
        return JSON.stringify(obj, null, indentSize);
      } catch (err) {
        return "";
      }
    };

    // Parse and validate JSON string
    const parseJSON = (text: string): JSONValue | null => {
      try {
        const parsed = JSON.parse(text);

        // Validate against schema if provided
        if (schema) {
          // Add your schema validation logic here
          // For example, using libraries like Ajv or Zod
        }

        setLocalError("");
        return parsed;
      } catch (err) {
        const error = err as Error;
        setLocalError(error.message);
        onValidationError?.(error);
        return null;
      }
    };

    // Update text when value prop changes
    React.useEffect(() => {
      setText(formatJSON(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText);

      if (validateOnChange) {
        const parsed = parseJSON(newText);
        if (parsed !== null) {
          onChange?.(parsed);
        }
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (formatOnBlur) {
        const parsed = parseJSON(text);
        if (parsed !== null) {
          const formatted = formatJSON(parsed);
          setText(formatted);
          onChange?.(parsed);
        }
      }
      props.onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle tab key for indentation
      if (e.key === "Tab") {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const spaces = " ".repeat(indentSize);
        const newText =
          text.substring(0, start) + spaces + text.substring(end);
        setText(newText);
        
        // Move cursor after indentation
        requestAnimationFrame(() => {
          e.currentTarget.selectionStart = start + indentSize;
          e.currentTarget.selectionEnd = start + indentSize;
        });
      }

      // Format with Ctrl/Cmd + Shift + F
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        const parsed = parseJSON(text);
        if (parsed !== null) {
          const formatted = formatJSON(parsed);
          setText(formatted);
          onChange?.(parsed);
        }
      }
    };

    return (
      <div className="space-y-1.5">
        <div
          className={cn(
            jsonInputVariants({ variant, size }),
            "relative",
            className
          )}
        >
          <textarea
            ref={ref}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full h-full min-h-[16rem] p-3 font-mono resize-y bg-transparent transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-destructive focus:ring-destructive"
            )}
            readOnly={readOnly}
            spellCheck={false}
            {...props}
          />

          {/* Format button */}
          {!readOnly && (
            <button
              type="button"
              onClick={() => {
                const parsed = parseJSON(text);
                if (parsed !== null) {
                  const formatted = formatJSON(parsed);
                  setText(formatted);
                  onChange?.(parsed);
                }
              }}
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground bg-background/80 rounded-md"
              title="Format JSON (Ctrl/Cmd + Shift + F)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {(localError || error || hint) && (
          <div
            className={cn(
              "text-sm",
              localError || error
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {localError || error || hint}
          </div>
        )}
      </div>
    );
  }
);

JSONInput.displayName = "JSONInput";

export { JSONInput, type JSONValue };
