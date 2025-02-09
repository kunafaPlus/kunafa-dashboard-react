import React, { ChangeEvent, ReactNode, SelectHTMLAttributes } from "react";
// import { colorPickerVariants } from "../ColorPicker";
// import { VariantProps } from "class-variance-authority";
// import { floatLabelVariants } from "../FloatLabel";
// import { inputGroupVariants } from "../InputGroup";
// import { inputNumberVariants } from "../InputNumber";
// import { Matrix, matrixInputVariants } from "../MatrixInput";
// import { multiSelectVariants } from "../MultiSelect";
// import { cascadeSelectVariants } from "../CascadeSelect";
// import { richTextEditorVariants } from "../RichTextEditor";
// import { scheduleInputVariants } from "../ScheduleInput";
// import { searchInputVariants } from "../SearchInput";
// import { selectVariants } from "../Select";
// import { signaturePadVariants } from "../SignaturePad";
// import { tagInputVariants } from "../TagInput";
// import { toggleVariants } from "../Toggle";
// import { voiceInputVariants } from "../VoiceInput";
// import { phoneInputVariants } from "../PhoneInput";
import { CountryCode } from "libphonenumber-js";
import { VariantProps } from "class-variance-authority";
import { colorPaletteInputVariants, dualRangeSliderVariants, iconFieldVariants, inputMaskVariants, inputVariants, jsonInputVariants, listBoxVariants, mentionInputVariants, multiStateCheckboxVariants, passwordInputVariants, passwordVariants, phoneInputVariants, progressVariants, richTextInputVariants, sliderVariants, switchTrackVariants, timeRangePickerVariants } from "../variants";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
type Matrix = number[][];

// Common Types
export type InputChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

// Common Props
export interface CommonInputProps {
  label?: string;
  name?: string;
  error?: string;
  touched?: boolean;
  onBlur?: ()=>void;
  id?:string
}

export interface CalendarProps
 {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  label: string;
  variant?: "default" | "bordered" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  className:string
}
export interface CodeInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  label?: string;
  error?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  hint?: string;
  minHeight?: number;
  maxHeight?: number;
  autoFocus?: boolean;
  placeholder?: string;
  onSave?: (value: string) => void;
  onFormat?: (value: string) => string;
  extensions?: any[];
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

// export   interface SwitchProps {
//     label: string;
//     name?: string;
//     checked?: boolean;
//     onChange?: (checked: boolean) => void;
//     disabled?: boolean;
//   }


  
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


  export interface ColorPickerProps  {
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    className?: string;
    variant?: string; 
    size?: string; 
  }

export   interface CurrencyInputProps  {
    variant?: string; 
    size?: string; 
    value?: number | null; 
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
  {
  label: string;
  error?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
  variant?: string; 
  size?: string; 
  value?: any; 
  className?: string;
  required?:boolean,
  disabled?:boolean,
  defaultValue?:string,
  onFocus?:any
  onChange?:any
  onBlur?:any
  id?:number

}
export interface InputGroupContextValue {
  variant?: string; 
  size?: string; 
  value?: number | null; 
  disabled?: boolean;
}

export interface InputGroupProps
  {
  disabled?: boolean;
  variant?: string; 
  size?: string; 
  value?: number | null; 
  className?:string,
  children?:React.ReactNode
}

export interface InputNumberProps
  {
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
  variant?: string; 
  size?: string; 
  className?: string; 
  disabled?: boolean; 
}

export interface MatrixInputProps
 {
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
  variant?: string; 
  className?: string; 
  size?: string; 
}

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
}

export interface MultiSelectProps {
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
  variant?: string; 
  size?: string; 
  className?:string
}

export interface CascadeOption {
  label: string;
  value: string;
  children?: CascadeOption[];
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface CascadeSelectProps {
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
  variant?: string; 
  size?: string; 
  error?:string
  className?:string
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

export interface RichTextEditorProps {
  value?: string;
  label?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  variant?: string; 
  size?: string; 
  className?:string,
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
   {
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
  variant?: string; 
  size?: string; 
  className?:string,

  
}
export interface SearchResult<T> {
  id: string | number;
  className?:string,

  title: string;
  description?: string;
  data: T;
  query?:any
}

export interface SearchInputProps<T>  {
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
  variant?: string; 
  size?: string; 
  value?: number | null; 
}

export interface SelectProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  label?:string
  error?:string
  variant?: string; 
  size?: string; 
  className?: string; 
  onChange?: (e:unknown)=>void; 

  value?: number | null; 
  disabled?:boolean,
  fullWidth?:boolean,

}


export interface Point {
  x: number;
  y: number;
  pressure: number;
}

export interface SignaturePadProps
{
  value?: string;
  className?: string;
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
  variant?: string; 
  size?: string; 
}

export interface TagInputProps{
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
  className:string,
  variant:string,
  size:string,

}

export interface ToggleProps{
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  iconOnly?: boolean;
  errors?:string
  variant?: string; 
  size?: string; 
  value?: number | null; 
  className?:string
  rounded?:string
  children?:ReactNode
  onClick:(event:unknown)=>void
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
export interface VoiceInputProps {
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
variant?: string; 
className?: string; 
size?: string; 
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



export interface ColumnProps {
  field: string;
  header: string;
  sortable?: boolean;
  body?: (data: any, row: any) => React.ReactNode;
  editable?: boolean; // Allow editing for this column
}

export interface DataTableProps {
  value: any[];
  children: React.ReactElement<ColumnProps>[] | React.ReactElement<ColumnProps>;
  filterable?: boolean;
  pagination?: boolean;
  rowsPerPage?: number;
  groupField?: string; // For grouping rows
  editable?: boolean; // Enable editing for the entire table
  onEdit?: (row: any, field: string, value: any) => void; // Handle cell edits
  exportToExcel?: boolean; // Enable Excel export
  convertToKanban?: boolean; // Enable Kanban conversion
  onConvertToKanban?: (data: any[]) => void; // Handle Kanban conversion
  treeTable?: boolean; // Enable tree table structure
  treeField?: string; // Field to use for tree hierarchy
}


interface Color {
  hex: string;
  rgb: string;
  name?: string;
}

interface Palette {
  colors: Color[];
  type: "custom" | "monochromatic" | "complementary" | "analogous" | "triadic" | "tetradic";
}

export interface ColorPaletteInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof colorPaletteInputVariants> {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  maxColors?: number;
  error?: string;
  hint?: string;
  showColorNames?: boolean;
  showRgbValues?: boolean;
  allowCustomColors?: boolean;
  presetPalettes?: Palette[];
  label?: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface CoordinateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  label?: string;
  error?: string;
}
export interface DualRangeSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof dualRangeSliderVariants> {
  value?: [number, number];
  onChange?: (e: { target: { value: [number, number] } }) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
}
export interface IconFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof iconFieldVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  hint?: string;
  iconClassName?: string;
  containerClassName?: string;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  iconClickable?: boolean;
  onIconClick?: (position: "left" | "right") => void;
  placeholderSpacing?: string; // New prop for custom placeholder spacing
}
export interface InputProps extends VariantProps<typeof inputVariants> {
  label?: string;
  id?: string;
  error?: string;
  icon?: React.ReactNode;
  endText?: string;
  isTextArea?: boolean;
  rows?: number;
  className?: string;
  placeholder?:string;
  type?:string;
  props?:any
}
export type MaskType =
| "numeric"
| "decimal"
| "currency"
| "percentage"
| "email"
| "phone"
| "date"
| "time"
| "creditCard"
| "custom";

export interface InputMaskProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputMaskVariants> {
  maskType?: MaskType;
  mask?: string;
  prefix?: string;
  suffix?: string;
  decimalSeparator?: string;
  thousandSeparator?: string;
  precision?: number;
  error?: string;
  hint?: string;
}

export interface JSONValue {
  [key: string]: any;
}

export interface JSONInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">,
    VariantProps<typeof jsonInputVariants> {
  value?: JSONValue;
  onChange?: (value: JSONValue) => void;
  error?: string;
  hint?: string;
  formatOnBlur?: boolean;
  validateOnChange?: boolean;
  indentSize?: number;
  readOnly?: boolean;
  schema?: any;
  onValidationError?: (error: Error) => void;
}
export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  value?: number;
  onChange?: (event: { target: { value: number } }) => void;
  min?: number;
  max?: number;
  step?: number;
  knobSize?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
}
export 
interface ListBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  metadata?: any;
}

export interface ListBoxProps
   {
  options: ListBoxOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  virtualScroll?: boolean;
  itemHeight?: number;
  emptyMessage?: React.ReactNode;
  loadingMessage?: React.ReactNode;
  renderOption?: (option: ListBoxOption) => React.ReactNode;
  filterOption?: (option: ListBoxOption, searchValue: string) => boolean;
  compareOption?: (option: ListBoxOption, value: string) => boolean;
  className?: string;
  variant?: VariantProps<typeof listBoxVariants>["variant"];
  size?: VariantProps<typeof listBoxVariants>["size"];
}

export interface Mention {
  id: string;
  display: string;
  avatar?: string;
  description?: string;
}

export interface MentionInputProps
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
 
export type CheckState = boolean | "indeterminate";

export interface MultiStateCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange">,
    VariantProps<typeof multiStateCheckboxVariants> {
  value?: CheckState;
  onChange?: (value: CheckState) => void;
  icon?: React.ReactNode;
  indeterminateIcon?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  states?: string[]; // إضافة خاصية states
}
export interface PasswordProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange">,
    VariantProps<typeof passwordVariants> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  showStrength?: boolean;
  strengthLevels?: {
    label: string;
    color: string;
    regex: RegExp;
  }[];
  error?: string;
  hint?: string;
  label?: string;
}
export 
interface PasswordStrength {
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
}

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof passwordInputVariants> {
  error?: string;
  hint?: string;
  showStrengthMeter?: boolean;
  showToggle?: boolean;
  showGenerator?: boolean;
  minLength?: number;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  onStrengthChange?: (strength: PasswordStrength) => void;
}


export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size">,
    VariantProps<typeof phoneInputVariants> {
  value?: string;
  onChange?: (value: PhoneNumber) => void;
  defaultCountry?: string;
  onlyCountries?: string[];
  preferredCountries?: string[];
  error?: string;
  label?: string;
  hint?: string;
  showFlags?: boolean;
  showCountryCode?: boolean;
  showFormatted?: boolean;
  validateOnBlur?: boolean;
}
export interface CountryData {
  [key: string]: { name: string; flag: string,code?:string };
}
export interface ProgressProps extends VariantProps<typeof progressVariants> {
  className?: string
  value?: number
  max?: number
  showValue?: boolean
  formatValue?: (value: number) => string
}
export interface RichTextInputProps
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

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof sliderVariants> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  showTooltip?: boolean;
}
export interface SortableItem {
  id: string | number;
  content: React.ReactNode;
  data?: any;
}

export interface SortableListInputProps{
  items: Array<{ id: string; content: string }>;
  value?: string[];
  onChange?: (event: { target: { value: string[] } }) => void;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  dragHandle?: boolean;
  renderItem?: (item: SortableItem) => React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  allowRemove?: boolean;
  onRemove?: (item: SortableItem) => void;
  className?: string;
}
export  interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof switchTrackVariants> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}


export interface TimeRange {
  start: string;
  end: string;
}

export interface TimeRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof timeRangePickerVariants> {
  value?: TimeRange;
  onChange?: (value: TimeRange) => void;
  minTime?: string;
  maxTime?: string;
  step?: number;
  format?: "12" | "24";
  showSeconds?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  startLabel?: string;
  endLabel?: string;
  validateRange?: (range: TimeRange) => boolean;
  onInvalidRange?: (range: TimeRange) => void;
}