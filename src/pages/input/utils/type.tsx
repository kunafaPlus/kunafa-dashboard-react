import { ChangeEvent, ReactNode, SelectHTMLAttributes } from "react";
import { colorPickerVariants } from "../ColorPicker";
import { VariantProps } from "class-variance-authority";
import { floatLabelVariants } from "../FloatLabel";
import { inputGroupVariants } from "../InputGroup";
import { inputNumberVariants } from "../InputNumber";
import { Matrix, matrixInputVariants } from "../MatrixInput";
import { multiSelectVariants } from "../MultiSelect";
import { cascadeSelectVariants } from "../CascadeSelect";
import { richTextEditorVariants } from "../RichTextEditor";
import { scheduleInputVariants } from "../ScheduleInput";
import { searchInputVariants } from "../SearchInput";
import { selectVariants } from "../Select";
import { signaturePadVariants } from "../SignaturePad";
import { tagInputVariants } from "../TagInput";
import { toggleVariants } from "../Toggle";
import { voiceInputVariants } from "../VoiceInput";
import { phoneInputVariants } from "../PhoneInput";
import { CountryCode } from "libphonenumber-js";

// Common Types
type InputChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

// Common Props
export interface CommonInputProps {
  label?: string;
  name?: string;
  error?: string;
  touched?: boolean;
  onBlur?: ()=>void;
  id?:string
}

// Input Component
export interface InputProps extends CommonInputProps {
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  endText?: string;
  isTextArea?: boolean;
  rows?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export interface RadioInputProps {
    id: string;
    label: string;
    name: string;
    checked?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }
export   interface DropdownOption {
    value: string;
    label: string;
  }

export   interface SwitchProps {
    label: string;
    name?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
  }


  
export interface CheckboxProps extends CommonInputProps {
    label: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
  }


  export interface CheckboxGroupProps extends CommonInputProps {
    label: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
  }

  export interface DropdownProps extends CommonInputProps {
    options: DropdownOption[];
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
  }
  
  export interface ValueWithLabel {
    value:string
    label:string
  }


  export interface ColorPickerProps extends VariantProps<typeof colorPickerVariants> {
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    className?: string;
  }

export   interface CurrencyInputProps  {
    variant?: string; // Define specific variants if needed
    size?: string; // Define specific sizes if needed
    value?: number | null; // Value should be a number or null
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    currencySymbol?: string;
    currencyCode?: string;
    locale?: string;
    precision?: number;
    min?: number;
    max?: number;
    step?: number;
    allowNegative?: boolean;
    showPrefix?: boolean;
    showSuffix?: boolean;
    error?: string;
    hint?: string;
    formatOptions?: Intl.NumberFormatOptions;
    onValueChange?: (value: { float: number | null; formatted: string }) => void;
    disabled?: boolean;
    label?: string;
    name?: string;
    className?: string;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  }
  export interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Array<{ value: string; label: string }>;
  }

  export interface CustomInputWithRightTextProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  rightText: string;
  size?: "sm" | "md" | "lg";
}
export interface FloatLabelProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof floatLabelVariants> {
  label: string;
  error?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}
export interface InputGroupContextValue {
  variant?: VariantProps<typeof inputGroupVariants>["variant"];
  size?: VariantProps<typeof inputGroupVariants>["size"];
  disabled?: boolean;
}

export interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupVariants> {
  disabled?: boolean;
}

export interface InputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange" | "type">,
    VariantProps<typeof inputNumberVariants> {
  value?: number;
  onChange?: (event: { target: { value: number } }) => void;
  label?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  controls?: boolean;
  format?: (value: number) => string;
  parse?: (value: string) => number;
  precision?: number;
  prefix?: string;
  suffix?: string;
  showButtons?: boolean;
  buttonPlacement?: "right" | "sides" | "stacked";
  locale?: string;
  hint?: string;
}

export interface MatrixInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof matrixInputVariants> {
  value?: Matrix;
  onChange?: (matrix: Matrix) => void;
  rows?: number;
  columns?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  error?: string;
  hint?: string;
  showRowNumbers?: boolean;
  showColumnNumbers?: boolean;
  validateMatrix?: (matrix: Matrix) => boolean;
  onInvalidMatrix?: (matrix: Matrix) => void;
  formatValue?: (value: number) => string;
  parseValue?: (value: string) => number;
  label?: string;
}

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
}

export interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof multiSelectVariants> {
  options: Option[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxItems?: number;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  error?: string;
  grouped?: boolean;
  chipVariant?: "default" | "rounded" | "square";
  renderOption?: (option: Option) => React.ReactNode;
  label?: string;
}

export interface CascadeOption {
  label: string;
  value: string;
  children?: CascadeOption[];
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface CascadeSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof cascadeSelectVariants> {
  options: CascadeOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string[];
  disabled?: boolean;
  loading?: boolean;
  showPath?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  label?:string,
  error?:string
}
export interface OTPInputProps {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  length?: number;
  label?: string;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  pattern?: RegExp;
  className?:string
}

export interface RichTextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof richTextEditorVariants> {
  value?: string;
  label?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  toolbar?: ("bold" | "italic" | "underline" | "link" | "image" | "list" | "heading")[];
}

export interface TimeSlot {
  day: number;
  start: string;
  end: string;
  enabled: boolean;
}

export interface Schedule {
  [key: number]: TimeSlot[];
}

export interface ScheduleInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof scheduleInputVariants> {
  value?: Schedule;
  onChange?: (schedule: Schedule) => void;
  minTime?: string;
  maxTime?: string;
  step?: number;
  format?: "12" | "24";
  disabled?: boolean;
  error?: string;
  hint?: string;
  dayLabels?: string[];
  allowMultipleSlots?: boolean;
  allowOverlap?: boolean;
  validateTimeSlot?: (slot: TimeSlot) => boolean;
  onInvalidTimeSlot?: (slot: TimeSlot) => void;
}
export interface SearchResult<T> {
  id: string | number;
  title: string;
  description?: string;
  data: T;
}

export interface SearchInputProps<T> extends VariantProps<typeof searchInputVariants> {
  className?: string;
  results?: SearchResult<T>[];
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult<T>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  loading?: boolean;
  debounceMs?: number;
  minChars?: number;
  label?: string;
  maxResults?: number;
  showHistory?: boolean;
  clearOnSelect?: boolean;
  renderResult?: (result: SearchResult<T>) => React.ReactNode;
  renderNoResults?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  filterResults?: (results: SearchResult<T>[], query: string) => SearchResult<T>[];
  disabled?: boolean;
  placeholder?:string
}
export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  label?:string
  error?:string
}


export interface Point {
  x: number;
  y: number;
  pressure: number;
}

export interface SignaturePadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof signaturePadVariants> {
  value?: string;
  onChange?: (value: string) => void;
  onBegin?: () => void;
  onEnd?: () => void;
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  minWidth?: number;
  maxWidth?: number;
  velocityFilterWeight?: number;
  error?: string;
  hint?: string;
  disabled?: boolean;
  label?:string
}

export interface TagInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange">,
    VariantProps<typeof tagInputVariants> {
  value?: string[];
  onChange?: (event: { target: { value: string[] } }) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  maxTags?: number;
  validateTag?: (tag: string) => boolean | string;
  suggestions?: string[];
  allowDuplicates?: boolean;
  delimiter?: string | RegExp;
}

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  iconOnly?: boolean;
  errors?:string
}


export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeSelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  options: TreeNode[];
  value?: string[];
  onChange?: (event: { target: { value: string[] } }) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}
export interface VoiceInputProps
extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
  VariantProps<typeof voiceInputVariants> {
value?: Blob;
onChange?: (event: { target: { value: Blob } }) => void;
onAudioData?: (blob: Blob) => void;
error?: string;
hint?: string;
language?: string;
continuous?: boolean;
interimResults?: boolean;
maxDuration?: number;
autoStart?: boolean;
visualizer?: boolean;
disabled?: boolean;
label?: string;
}
export interface FileWithPreview extends File {
  preview?: string;
}
export  interface FileDropzoneProps {
  className?: string; // Optional className for styling
  variant?: 'default' | 'filled' | 'ghost'; // Variant types
  size?: 'sm' | 'md' | 'lg'; // Size types
  value?: FileWithPreview[]; // Array of files with preview
  onChange?: (event: { target: { value: FileWithPreview[] } }) => void; // Change event handler
  onError?: (error: string) => void; // Error handler
  accept?: string | string[]; // Accepted file types
  maxFiles?: number; // Maximum number of files
  maxSize?: number; // Maximum file size
  minSize?: number; // Minimum file size
  disabled?: boolean; // Disable state
  error?: string; // Error message
  hint?: string; // Hint message
  preview?: boolean; // Show preview
  previewMaxHeight?: number; // Max height for previews
  showFileList?: boolean; // Show file list
  renderPreview?: (file: FileWithPreview) => React.ReactNode; // Custom render for previews
  validateFile?: (file: File) => boolean | string; // Custom file validation
  onDragEnter?: (e: React.DragEvent) => void; // Drag enter event handler
  onDragLeave?: (e: React.DragEvent) => void; // Drag leave event handler
  onDrop?: (e: React.DragEvent) => void; // Drop event handler
  label?: string; // Label for the dropzone
  children?:React.ReactNode
}
export interface FileUploaderProps
{
 className?: string; // Optional className for styling
 variant?: 'default' | 'filled' | 'ghost'; // Variant types
 size?: 'sm' | 'md' | 'lg'; // Size types
accept?: string;
maxSize?: number;
maxFiles?: number;
disabled?: boolean;
onFilesSelected?: (files: File[]) => void;
onError?: (error: string) => void;
preview?: boolean;
dragActiveContent?: React.ReactNode;
children?: React.ReactNode;
label?:string,
error?:string
}
export interface PhoneNumber {
  number: string;
  countryCode: CountryCode;
  isValid: boolean;
  formatted: string;
  international: string;
  national: string;
  countryCallingCode: string;
}
export interface PhoneInputProps
extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size">,
  VariantProps<typeof phoneInputVariants> {
value?: string;
onChange?: (value: PhoneNumber) => void;
defaultCountry?: CountryCode;
onlyCountries?: CountryCode[];
preferredCountries?: CountryCode[];
error?: string;
label?: string;
hint?: string;
showFlags?: boolean;
showCountryCode?: boolean;
showFormatted?: boolean;
validateOnBlur?: boolean;
disabled?: boolean;
}