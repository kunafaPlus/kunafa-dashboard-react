import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const mentionInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "[&_textarea]:border [&_textarea]:rounded-md",
        filled: "[&_textarea]:bg-muted [&_textarea]:border-b",
        ghost: "[&_textarea]:bg-transparent [&_textarea]:border-b",
      },
      size: {
        sm: "[&_textarea]:text-sm [&_textarea]:p-2",
        md: "[&_textarea]:text-base [&_textarea]:p-3",
        lg: "[&_textarea]:text-lg [&_textarea]:p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface Mention {
  id: string;
  display: string;
  avatar?: string;
  description?: string;
}

interface MentionInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange" | "size">,
    VariantProps<typeof mentionInputVariants> {
  value?: string;
  mentions?: Mention[];
  onChange?: (value: string, mentions: Mention[]) => void;
  suggestions?: Mention[];
  trigger?: string;
  maxSuggestions?: number;
  minSearchLength?: number;
  highlightColor?: string;
  error?: string;
  hint?: string;
  renderSuggestion?: (suggestion: Mention, isSelected: boolean) => React.ReactNode;
  onMentionAdd?: (mention: Mention) => void;
  onMentionRemove?: (mention: Mention) => void;
}

const MentionInput = React.forwardRef<HTMLTextAreaElement, MentionInputProps>(
  (
    {
      className,
      variant,
      size,
      value = "",
      mentions = [],
      onChange,
      suggestions = [],
      trigger = "@",
      maxSuggestions = 5,
      minSearchLength = 1,
      highlightColor = "var(--primary)",
      error,
      hint,
      renderSuggestion,
      onMentionAdd,
      onMentionRemove,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [searchText, setSearchText] = React.useState("");
    const [cursorPosition, setCursorPosition] = React.useState(0);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(0);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!);

    const getSearchPosition = (text: string, position: number): number => {
      for (let i = position - 1; i >= 0; i--) {
        if (text[i] === trigger) {
          return i;
        }
        if (/\s/.test(text[i])) {
          return -1;
        }
      }
      return -1;
    };

    const getFilteredSuggestions = () => {
      if (!searchText) return [];
      return suggestions
        .filter((suggestion) =>
          suggestion.display
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
        .slice(0, maxSuggestions);
    };

    const insertMention = (mention: Mention) => {
      const searchPosition = getSearchPosition(value, cursorPosition);
      if (searchPosition === -1) return;

      const beforeMention = value.slice(0, searchPosition);
      const afterMention = value.slice(cursorPosition);
      const newValue = `${beforeMention}${trigger}${mention.display} ${afterMention}`;
      const newPosition = searchPosition + mention.display.length + 2;

      onChange?.(newValue, [...mentions, mention]);
      onMentionAdd?.(mention);

      setShowSuggestions(false);
      setSearchText("");
      setSelectedSuggestionIndex(0);

      // Set cursor position after mention
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const newPosition = e.target.selectionStart || 0;
      const searchPosition = getSearchPosition(newValue, newPosition);

      setCursorPosition(newPosition);

      if (searchPosition !== -1) {
        const search = newValue
          .slice(searchPosition + 1, newPosition)
          .trim();
        setSearchText(search);
        setShowSuggestions(search.length >= minSearchLength);
      } else {
        setShowSuggestions(false);
        setSearchText("");
      }

      onChange?.(newValue, mentions);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showSuggestions) return;

      const filteredSuggestions = getFilteredSuggestions();

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          Math.min(prev + 1, filteredSuggestions.length - 1)
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter" && filteredSuggestions.length > 0) {
        e.preventDefault();
        insertMention(filteredSuggestions[selectedSuggestionIndex]);
      }

      if (e.key === "Escape") {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(0);
      }
    };

    const defaultRenderSuggestion = (
      suggestion: Mention,
      isSelected: boolean
    ) => (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2",
          isSelected && "bg-accent"
        )}
      >
        {suggestion.avatar && (
          <img
            src={suggestion.avatar}
            alt={suggestion.display}
            className="w-6 h-6 rounded-full"
          />
        )}
        <div>
          <div className="font-medium">{suggestion.display}</div>
          {suggestion.description && (
            <div className="text-sm text-muted-foreground">
              {suggestion.description}
            </div>
          )}
        </div>
      </div>
    );

    const highlightMentions = (text: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      // Simple mention pattern - can be enhanced for more complex patterns
      const pattern = new RegExp(`${trigger}([\\w]+)`, "g");
      let match;

      while ((match = pattern.exec(text)) !== null) {
        // Add text before mention
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }

        // Add highlighted mention
        parts.push(
          <span
            key={match.index}
            style={{
              backgroundColor: `${highlightColor}20`,
              color: highlightColor,
              borderRadius: "0.25rem",
              padding: "0 0.25rem",
            }}
          >
            {match[0]}
          </span>
        );

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts;
    };

    return (
      <div
        ref={containerRef}
        className={cn(mentionInputVariants({ variant, size }), className)}
      >
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none p-[inherit]"
            aria-hidden="true"
          >
            {highlightMentions(value)}
          </div>
          <textarea
            ref={textareaRef}
            className={cn(
              "w-full bg-transparent transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed resize-none",
              error && "border-destructive focus:ring-destructive"
            )}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            style={{
              color: "transparent",
              caretColor: "var(--foreground)",
            }}
            {...props}
          />

          {showSuggestions && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-[200px] overflow-auto">
              {getFilteredSuggestions().map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className="cursor-pointer hover:bg-accent"
                  onMouseDown={() => insertMention(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  {renderSuggestion
                    ? renderSuggestion(
                        suggestion,
                        index === selectedSuggestionIndex
                      )
                    : defaultRenderSuggestion(
                        suggestion,
                        index === selectedSuggestionIndex
                      )}
                </div>
              ))}
            </div>
          )}
        </div>

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

MentionInput.displayName = "MentionInput";

export { MentionInput, type Mention };
