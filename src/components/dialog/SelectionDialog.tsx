import * as React from "react";
import { cn } from "../../utils/cn";
import { BiCheck, BiChevronDown, BiChevronUp, BiSearch, BiX } from "react-icons/bi";
import { SelectionDialogProps, SelectionOption } from "./types";

const SelectionDialog = React.forwardRef<HTMLDivElement, SelectionDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      title = "Select Options",
      description,
      options = [],
      value = [],
      onChange,
      multiple = false,
      searchable = true,
      searchPlaceholder = "Search...",
      noOptionsMessage = "No options found",
      maxHeight = 300,
      groupBy = "none",
      showSelectedCount = true,
      closeOnSelect = !multiple,
      required = false,
      className,
      ...props
    },
    ref
  ) => {
    const [search, setSearch] = React.useState("");
    const [groups, setGroups] = React.useState<Record<string, boolean>>({});

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );

    const groupedOptions = React.useMemo(() => {
      if (filteredOptions.length === 0) return {};

      if (groupBy === "none") return { ungrouped: filteredOptions };

      return filteredOptions.reduce<Record<string, SelectionOption[]>>(
        (acc, option) => {
          const group = option.group || "ungrouped";
          if (!acc[group]) acc[group] = [];
          acc[group].push(option);
          return acc;
        },
        {}
      );
    }, [filteredOptions, groupBy]);

    const toggleOption = (optionId: string) => {
      const option = options.find((o) => o.id === optionId);
      if (option?.disabled) return;

      if (multiple) {
        const newValue = value.includes(optionId)
          ? value.filter((id) => id !== optionId)
          : [...value, optionId];
        if (onChange) onChange(newValue);
      } else {
        if (onChange) onChange([optionId]);
      }

      if (closeOnSelect) {
        if (onOpenChange) onOpenChange(false);
      }
    };

    const toggleGroup = (group: string) => {
      setGroups((prev) => ({
        ...prev,
        [group]: !prev[group],
      }));
    };

    const handleSelectAll = () => {
      const enabledOptions = filteredOptions.filter((option) => !option.disabled);
      const newValue =
        value.length === enabledOptions.length
          ? []
          : enabledOptions.map((o) => o.id);
      if (onChange) onChange(newValue);
    };

    const renderOption = (option: SelectionOption) => (
      <button
        key={option.id}
        type="button"
        onClick={() => !option.disabled && toggleOption(option.id)}
        disabled={option.disabled}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
          option.disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-muted",
          value.includes(option.id) && "bg-primary/10"
        )}
      >
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-200",
            value.includes(option.id)
              ? "border-primary bg-primary text-white"
              : "border-muted-foreground "
          )}
        >
          {value.includes(option.id) && <BiCheck className="h-3 w-3" />}
        </div>
        {option.icon && <div className="shrink-0">{option.icon}</div>}
        <div className="flex-1 space-y-0.5">
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="text-xs text-muted-foreground">
              {option.description}
            </div>
          )}
        </div>
      </button>
    );

    // نقل الشرط إلى هنا، بعد استدعاء جميع الـ Hooks
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" {...props}>
        <div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
            className
          )}
          ref={ref}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                {title}
                {showSelectedCount && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({value.length} selected)
                  </span>
                )}
              </h2>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <BiX className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Search */}
          {searchable && (
            <div className="relative">
              <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          )}

          {/* Options */}
          <div
            className="space-y-2 overflow-y-auto"
            style={{ maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }}
          >
            {multiple && filteredOptions.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="mb-2 text-sm text-primary hover:underline"
              >
                {value.length === filteredOptions.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}

            {Object.entries(groupedOptions).map(([group, options]) => (
              <div key={group} className="space-y-1">
                {group !== "ungrouped" && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {group}
                    {groups[group] ? (
                      <BiChevronUp className="h-4 w-4" />
                    ) : (
                      <BiChevronDown className="h-4 w-4" />
                    )}
                  </button>
                )}
                {(group === "ungrouped" || groups[group]) &&
                  options.map(renderOption)}
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {noOptionsMessage}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              disabled={required && value.length === 0}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SelectionDialog.displayName = "SelectionDialog";

export {
  SelectionDialog,
  type SelectionDialogProps,
  type SelectionOption,
};