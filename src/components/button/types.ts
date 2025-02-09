import { ButtonHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./variants";

// Base button props that all buttons extend
export interface BaseButtonProps
  {
    size?:any,
    className?:string,
    variants?:any,
    variant?:any,
    children?:React.ReactNode

  }

// Glass Button
export interface GlassButtonProps extends BaseButtonProps {
  blurAmount?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  backgroundColor?: string;
  borderColor?: string;
  enableHover?: boolean;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  frostEffect?: boolean;
}

// Save Button
export interface SaveButtonProps extends BaseButtonProps {
  onSave?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  loadingText?: string;
  savedText?: string;
  showIcon?: boolean;
  saved?: boolean;
  loading?: boolean;
 
}
export interface RadioButtonItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  value: string;
  selected?: boolean;
  className?: string;
}


// Share Button
export interface ShareButtonProps extends BaseButtonProps {
  url?: string;
  title?: string;
  text?: string;
  platforms?: ("facebook" | "twitter" | "linkedin" | "whatsapp")[];
  onShare?: (platform: string) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showIcon :boolean,
  loading :boolean,
  onBeforeShare:()=>void,
  onAfterShare:()=>void,
}

// Social Button
export interface SocialButtonProps extends BaseButtonProps {
  provider: "google" | "github" | "facebook" | "twitter";
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  showIcon?: boolean;
  loading?: boolean;
  onBeforeShare?:()=>void,
  onAfterShare?:()=>void,
}

// Voice Command Button
export interface VoiceCommandButtonProps extends BaseButtonProps {
  onCommand?: (command: string) => void;
  commands?: string[];
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  recognitionTimeout?: number;
  onStateChange:()=>void
}

// Scroll To Top Button
export interface ScrollToTopButtonProps extends BaseButtonProps {
  showAfter?: number; // Show after scrolling X pixels
  smooth?: boolean;
  behavior?: ScrollBehavior;
  showIcon?: boolean;
}

// Progress Button
export interface ProgressButtonProps extends BaseButtonProps {
  progress: number;
  showValue?: boolean;
  valuePosition?: "inside" | "outside";
  progressColor?: string;
  trackColor?: string;
  loading?:boolean;
  progressPosition?: "bottom" | "overlay";
}

// Print Button
export interface PrintButtonProps extends BaseButtonProps {
  content?: React.ReactNode;
  options?: {
    pageSize?: "A4" | "Letter" | "Legal";
    orientation?: "portrait" | "landscape";
    margin?: string;
  };
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
  printOptions:{
    pageSize?: "A4" | "Letter" | "Legal";
    margin?:string
  },
  showIcon :boolean,
}

// Upload Button
export interface UploadButtonProps extends BaseButtonProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  showProgress?: boolean;
  showPreview?: boolean;
  showFileInfo?: boolean;
  dragAndDrop?: boolean;
  onChange?: (files: File[]) => void;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (files: File[]) => void;
  onUploadError?: (error: Error) => void;

  onFilesSelected:(files: File[]) => void,
  loading :boolean,
  icon ?:React.ReactNode
}

// 3D Button
export interface ThreeDButtonProps extends BaseButtonProps {
  depth?: number; // The 3D depth effect in pixels
  pressEffect?: boolean; // Enable press animation
  shadowColor?: string;
  activeColor?: string;
  pressed?: boolean;
  onMouseLeave?:(e:any)=>void
  onMouseDown?:(e:any)=>void
  onMouseUp?:(e:any)=>void
}

// Swipe Button
export interface SwipeButtonProps extends BaseButtonProps {
  onSwipeComplete?: () => void;
  swipeText?: string;
  completeText?: string;
  resetAfterComplete?: boolean;
  resetTimeout?: number;
  direction?: "left" | "right";
  threshold?: number;
}

// Segmented Button
export interface SegmentedButtonProps extends BaseButtonProps {
  options: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  value?: string|undefined;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
  defaultValue?:string
}
export interface RadioButtonGroupProps  {
  orientation?: "horizontal" | "vertical";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  children: React.ReactNode;
}

// Radio Button Group
// export interface RadioButtonGroupProps extends Omit<BaseButtonProps, "value" | "onChange"> {
//   options: Array<{
//     label: string;
//     value: string;
//     disabled?: boolean;
//   }>;
//   value?: string;
//   selected?: boolean;
//   onChange?: (value: string) => void;
//   orientation?: "horizontal" | "vertical";
// }

// Split Button
export interface SplitButtonProps extends BaseButtonProps {
  options: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  onMainClick?: () => void;
  onOptionSelect?: (value: string) => void;
  mainLabel: string;
  mainIcon?: React.ReactNode;
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
}

// Status Button
export interface StatusButtonProps extends BaseButtonProps {
  status: "online" | "offline" | "away" | "busy" | "custom";
  customColor?: string;
  pulseEffect?: boolean;
  showLabel?: boolean;
  label?: string;
  indicatorPosition?: "start" | "end";
}

// Switch Button
export interface SwitchButtonProps extends Omit<BaseButtonProps, "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  onCheckedChange?: (checked: boolean) => void;
  trackColor?: string;
}

// Theme Toggle Button
export interface ThemeToggleButtonProps extends BaseButtonProps {
  theme?: "light" | "dark" | "system";
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
  showIcon?: boolean;
  showLabel?: boolean;
  showText?: boolean;
}

// Toggle Button
export interface ToggleButtonProps extends BaseButtonProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  onClick?: (e: any) => void;
  activeVariant?: VariantProps<typeof buttonVariants>["variant"];
}

// Toolbar Button
export interface ToolbarButtonProps extends BaseButtonProps {
  active?: boolean;
  tooltip?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  shortcut?: string;
  icon?: React.ReactNode;
}

// Tooltip Button
export interface TooltipButtonProps extends BaseButtonProps {
  tooltip: string;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  showArrow?: boolean;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  tooltipDelay?: number;
}

// Video Play Button
export interface VideoPlayButtonProps extends BaseButtonProps {
  playing?: boolean;
  onPlayPause?: (playing: boolean) => void;
  showProgress?: boolean;
  progress?: number;
  size?: "sm" | "md" | "lg" | "xl";
  videoRef: React.RefObject<HTMLVideoElement>;
  onPlayStateChange: (isPlaying: boolean) => void;
}

// Alert Button
export interface AlertButtonProps extends BaseButtonProps {
  confirmText?: string;
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
