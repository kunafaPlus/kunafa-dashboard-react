import * as React from "react";
import { cn } from "../../../utils/cn";
import { CiSettings } from "react-icons/ci";
import { FiEyeOff } from "react-icons/fi";
import { BiChevronDown, BiChevronRight, BiPalette, BiX } from "react-icons/bi";


interface CustomizationOption {
  id: string;
  label: string;
  type: "select" | "radio" | "checkbox" | "color" | "range" | "text";
  description?: string;
  options?: Array<{ value: string; label: string }>;
  value?: any;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  preview?: boolean;
}

interface CustomizationSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options: CustomizationOption[];
}

interface CustomizationDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  sections: CustomizationSection[];
  values: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  onReset?: () => void;
  showPreview?: boolean;
  previewComponent?: React.ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const CustomizationDialog = React.forwardRef<HTMLDivElement, CustomizationDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      title = "Customize",
      description,
      sections = [],
      values = {},
      onChange,
      onReset,
      showPreview = true,
      previewComponent,
      showSearch = true,
      searchPlaceholder = "Search settings...",
      className,
      ...props
    },
    ref
  ) => {
    const [search, setSearch] = React.useState("");
    const [expandedSections, setExpandedSections] = React.useState<string[]>([]);
    const [showPreviewPanel, setShowPreviewPanel] = React.useState(true);

    if (!open) return null;

    const toggleSection = (sectionId: string) => {
      setExpandedSections((prev) =>
        prev.includes(sectionId)
          ? prev.filter((id) => id !== sectionId)
          : [...prev, sectionId]
      );
    };

    const handleOptionChange = (optionId: string, value: any) => {
      onChange?.({
        ...values,
        [optionId]: value,
      });
    };

    const filteredSections = sections.map((section) => ({
      ...section,
      options: section.options.filter(
        (option) =>
          option.label.toLowerCase().includes(search.toLowerCase()) ||
          option.description?.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter((section) => section.options.length > 0);

    const renderOption = (option: CustomizationOption) => {
      const value = values[option.id] ?? option.defaultValue;

      switch (option.type) {
        case "select":
          return (
            <select
              value={value}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {option.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );

        case "radio":
          return (
            <div className="space-y-2">
              {option.options?.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    checked={value === opt.value}
                    onChange={() => handleOptionChange(option.id, opt.value)}
                    className="h-4 w-4 rounded-full border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          );

        case "checkbox":
          return (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {option.label}
            </label>
          );

        case "color":
          return (
            <input
              type="color"
              value={value}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="h-8 w-full cursor-pointer rounded-md border border-input"
            />
          );

        case "range":
          return (
            <div className="space-y-2">
              <input
                type="range"
                min={option.min}
                max={option.max}
                step={option.step}
                value={value}
                onChange={(e) =>
                  handleOptionChange(option.id, parseFloat(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{option.min}</span>
                <span>{value}</span>
                <span>{option.max}</span>
              </div>
            </div>
          );

        case "text":
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" {...props}>
        <div
          className={cn(
            "fixed inset-6 z-50 grid gap-4 border bg-background shadow-lg duration-200 sm:rounded-lg",
            showPreview ? "grid-cols-[2fr,1fr]" : "grid-cols-1",
            className
          )}
          ref={ref}
        >
          {/* Settings Panel */}
          <div className="flex h-full flex-col overflow-hidden border-r">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CiSettings className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {showPreview && (
                  <button
                    type="button"
                    onClick={() => setShowPreviewPanel(!showPreviewPanel)}
                    className="rounded-md p-2 hover:bg-muted"
                  >
                    <FiEyeOff className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenChange?.(false)}
                  className="rounded-md p-2 hover:bg-muted"
                >
                  <BiX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            {showSearch && (
              <div className="border-b p-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            )}

            {/* Sections */}
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y">
                {filteredSections.map((section) => (
                  <div key={section.id} className="p-4">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between text-sm font-medium"
                    >
                      <div className="flex items-center gap-2">
                        {section.icon}
                        {section.label}
                      </div>
                      {expandedSections.includes(section.id) ? (
                        <BiChevronDown className="h-4 w-4" />
                      ) : (
                        <BiChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {expandedSections.includes(section.id) && (
                      <div className="mt-4 space-y-4">
                        {section.options.map((option) => (
                          <div key={option.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{option.label}</div>
                                {option.description && (
                                  <div className="text-sm text-muted-foreground">
                                    {option.description}
                                  </div>
                                )}
                              </div>
                              {option.preview && (
                                <div className="flex h-6 w-6 items-center justify-center rounded border text-xs">
                                  <BiPalette className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            {renderOption(option)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t p-4">
              <button
                type="button"
                onClick={onReset}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reset to defaults
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenChange?.(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange?.(false)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && showPreviewPanel && (
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b p-4">
                <div className="font-medium">Preview</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {previewComponent}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CustomizationDialog.displayName = "CustomizationDialog";

export {
  CustomizationDialog,
  type CustomizationDialogProps,
  type CustomizationSection,
  type CustomizationOption,
};
