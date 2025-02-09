import { VariantProps } from "class-variance-authority";
import { dialogVariants } from "../variants";
import { ReactNode } from "react";

export type ConfirmType = "info" | "success" | "warning" | "error";

export interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: ConfirmType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  hideCancel?: boolean;
  className?: string;
}
export interface CustomDialogProps extends VariantProps<typeof dialogVariants> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    description?: string;
    showCloseButton?: boolean;
    actions?: ReactNode;
    className?: string;
}


export interface CustomizationOption {
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

export interface CustomizationSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options: CustomizationOption[];
}

export interface CustomizationDialogProps extends React.HTMLAttributes<HTMLDivElement> {
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
export interface FormDialogProps  {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  success?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  preventClose?: boolean;
  showDividers?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export interface ImagePreviewDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  images: Array<{
    src: string;
    alt?: string;
    title?: string;
  }>;
  initialIndex?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  allowDownload?: boolean;
  onIndexChange?: (index: number) => void;
}

export interface LoadingDialogProps  {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  progress?: number;
  showProgress?: boolean;
  cancelable?: boolean;
  onCancel?: () => void;
  variant?: "default" | "blur" | "minimal";
  size?: "sm" | "md" | "lg";
  spinnerSize?: number;
  spinnerColor?: string;
  spinnerClassName?: string;
  className?: string;
}

export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export interface NotificationDialogProps  {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: NotificationType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: NotificationAction[];
  autoClose?: number;
  showCloseButton?: boolean;
  position?: "top" | "bottom";
  animation?: "slide" | "fade";
  width?: "sm" | "md" | "lg" | "xl" | "full";
  onClose?: () => void;
  className?: string;
}


export interface SelectionOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

export interface SelectionDialogProps  {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  options: SelectionOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  maxHeight?: number | string;
  groupBy?: "none" | "group";
  showSelectedCount?: boolean;
  closeOnSelect?: boolean;
  required?: boolean;
  className?: string;
}

export interface ShareOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  url: string;
  color?: string;
}

export interface ShareDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  url: string;
  text?: string;
  customOptions?: ShareOption[];
  showCopyLink?: boolean;
  showNativeShare?: boolean;
  onShare?: (option: ShareOption) => void;
}
export interface VideoDialogProps  {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playbackRates?: number[];
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  className?: string;
}

export interface WizardStep {
  title: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

export interface WizardDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  steps: WizardStep[];
  title?: string;
  description?: string;
  finishLabel?: string;
  cancelLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  onFinish?: (currentStep: number) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  preventClose?: boolean;
  showStepIndicator?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}
