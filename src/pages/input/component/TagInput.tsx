import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';
import { TagInputProps } from '../utils/type';

export const tagInputVariants = cva('w-full', {
  variants: {
    variant: {
      default: '[&_input]:border [&_input]:rounded-md',
      filled: '[&_input]:bg-muted [&_input]:border-b',
      ghost: '[&_input]:bg-transparent [&_input]:border-b',
    },
    size: {
      sm: '[&_input]:text-sm [&_input]:p-2',
      md: '[&_input]:text-base [&_input]:p-3',
      lg: '[&_input]:text-lg [&_input]:p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      label,
      error,
      placeholder = 'أضف وسماً...',
      maxTags,
      validateTag = () => true,
      suggestions = [],
      allowDuplicates = false,
      delimiter = /[,\n\r]/,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState('');
    const [internalTags, setInternalTags] = React.useState<string[]>(
      Array.isArray(value) ? value : []
    );
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (Array.isArray(value)) {
        setInternalTags(value);
      }
    }, [value]);

    const handleAddTag = (tag: string) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag) return;

      const validationResult = validateTag(trimmedTag);
      if (validationResult !== true) return;

      if (maxTags && internalTags.length >= maxTags) return;

      if (!allowDuplicates && internalTags.includes(trimmedTag)) return;

      const newTags = [...internalTags, trimmedTag];
      setInternalTags(newTags);
      setInputValue('');

      if (onChange) {
        onChange({
          target: {
            value: newTags,
          },
        });
      }
      setShowSuggestions(false); // Hide suggestions after adding a tag
    };

    const handleRemoveTag = (indexToRemove: number) => {
      const newTags = internalTags.filter((_, index) => index !== indexToRemove);
      setInternalTags(newTags);

      if (onChange) {
        onChange({
          target: {
            value: newTags,
          },
        });
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (delimiter instanceof RegExp && delimiter.test(newValue)) {
        const tags = newValue
          .split(delimiter)
          .map((tag) => tag.trim())
          .filter(Boolean);

        tags.forEach(handleAddTag);
      }

      // Show suggestions based on input value
      setShowSuggestions(newValue.length > 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        handleAddTag(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && internalTags.length > 0) {
        handleRemoveTag(internalTags.length - 1);
      }
    };

    const filteredSuggestions = suggestions.filter(
      (suggestion: string) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        (allowDuplicates || !internalTags.includes(suggestion))
    );

    return (
      <div className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div
          className={cn(
            'flex flex-wrap gap-2 p-2 border rounded-md focus-within:border-primary',
            error && 'border-red-500',
            className
          )}
        >
          {internalTags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded-md"
            >
              {tag}
              <button
                type="button"
                onClick={() => { handleRemoveTag(index); }}
                className="hover:text-primary/80"
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={internalTags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent"
            {...props}
          />
        </div>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredSuggestions.map((suggestion: string, index: number) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => { handleAddTag(suggestion); }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';

export { TagInput };
