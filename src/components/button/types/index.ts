// Base Button Props
export interface BaseButtonProps {
  size?: any;
  variant?: any;
  children?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  onClick?:(e:any)=> void;
}
export interface labelWithId{
  id:number,
  label:string
}
// Basic Buttons
export interface CustomButtonProps extends BaseButtonProps {
  customClassName?: string;
  customStyle?: React.CSSProperties;
}

export interface IconButtonProps extends BaseButtonProps {
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
}

export interface GradientButtonProps extends BaseButtonProps {
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b';
}

export interface GlassButtonProps extends BaseButtonProps {
  blurAmount?: string;
  backgroundColor?: string;
  borderColor?: string;
  enableHover:boolean,
  hoverBackgroundColor :string,
  hoverBorderColor:string,
  frostEffect:boolean,
}

export interface ThreeDButtonProps extends BaseButtonProps {
  depth?: 'sm' | 'md' | 'lg';
  pressEffect?: boolean;
}

// Interactive Buttons
export interface HoverButtonProps extends BaseButtonProps {
  hoverEffect?: 'scale' | 'glow' | 'lift' | 'color';
  hoverScale?: number;
  hoverColor?: string;
}

export interface PressButtonProps extends BaseButtonProps {
  pressEffect?: 'scale' | 'shadow' | 'color';
  pressScale?: number;
  pressColor?: string;
}

export interface HoldButtonProps extends BaseButtonProps {
  holdDuration?: number;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  onHoldComplete?: () => void;
  showProgress?: boolean;
}

export interface SwipeButtonProps extends BaseButtonProps {
  direction?: 'left' | 'right';
  threshold?: number;
  onSwipeComplete?: () => void;
  swipeText?: string;
}

// Navigation Button Types
export interface BackButtonProps extends BaseButtonProps {
  fallbackUrl?: string;
  confirmNavigation?: boolean;
  confirmMessage?: string;
}

export interface ScrollButtonProps extends BaseButtonProps {
  targetId?: string;
  targetRef?: React.RefObject<HTMLElement>;
  offset?: number;
  smooth?: boolean;
}

export interface MenuButtonProps extends BaseButtonProps {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  renderMenu?: () => React.ReactNode;
}

// Already defined AudioButtonProps stays the same
export interface AudioButtonProps extends BaseButtonProps {
  src: string;
  autoPlay?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  showVolume?: boolean;
  showPlaybackRate?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
}

// Add other button type interfaces here
export interface LoadingButtonProps extends BaseButtonProps {
  loadingText?: string;
  spinnerPosition?: 'left' | 'right';
}

export interface DropdownButtonProps extends BaseButtonProps {
  items: Array<{
    label: string;
    value: string;
    onClick: () => void;
  }>;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

// Alert Button Types
export interface AlertButtonProps extends BaseButtonProps {
  message?: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// Biometric Button Types
export interface BiometricButtonProps extends BaseButtonProps {
  onAuthenticate?: (credential: Credential) => void;
  onError?: (error: string) => void;
  promptMessage?: string;
}

// Button Group Types
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "default" | "large";
}

// Comment Button Types
export interface CommentButtonProps extends BaseButtonProps {
  count?: number;
  showCount?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Copy Button Types
export interface CopyButtonProps extends BaseButtonProps {
  value: string;
  timeout?: number;
  onCopy?: (value: string) => void;
}



// Custom Button Props
export interface CustomButtonProps extends BaseButtonProps {
  loading?: boolean;
  active?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  elevated?: boolean;
  animated?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loadingText?: string;
}

// Download Button Props
export interface DownloadButtonProps extends BaseButtonProps {
  url: string;
  filename?: string;
  onDownloadStart?: () => void;
  onDownloadProgress?: (progress: number) => void;
  onDownloadComplete?: () => void;
  onError?: (error: string) => void;
}

// Dropdown Button Props
export interface DropdownItem {
  // id?: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
  className?: string;
}

export interface DropdownButtonProps extends BaseButtonProps {
  // items: DropdownItem[];
  trigger?: React.ReactNode;
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  offset?: number;
}

// Filter Button Props
export interface FilterOption {
  id: string;
  label: React.ReactNode;
}

export interface FilterButtonProps extends BaseButtonProps {
  filters: FilterOption[];
  selectedFilters: string[];
  onFilterChange?: (selectedFilters: string[]) => void;
}

// Floating Button Props
export interface FloatingButtonProps extends BaseButtonProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  offset?: number;
  icon?: React.ReactNode;
}

// Follow Button Props
export interface FollowButtonProps extends BaseButtonProps {
  isFollowing?: boolean;
  onFollow?: () => Promise<void> | void;
  onUnfollow?: () => Promise<void> | void;
  followingText?: string;
  unfollowText?: string;
}

// Gesture Button Props
export interface GestureButtonProps extends BaseButtonProps {
  gesture?: "press" | "swipe-left" | "swipe-right" | "swipe-up" | "swipe-down";
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
  onGestureChange?: (progress: number) => void;
  minDuration?: number;
  maxDuration?: number;
}

// HoverButton Props
export interface HoverButtonProps extends BaseButtonProps {
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  tooltipDelay?: number;
  tooltipOffset?: number;
  onHoverStart?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHoverEnd?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// LikeButton Props
export interface LikeButtonProps extends BaseButtonProps {
  isLiked?: boolean;
  count?: number;
  showCount?: boolean;
  animated?: boolean;
  onLike?: () => Promise<void> | void;
  onUnlike?: () => Promise<void> | void;
}

// LoadingButton Props
export interface LoadingButtonProps extends BaseButtonProps {
  loading?: boolean;
  loadingText?: string;
  loadingPosition?: 'start' | 'end';
  spinner?: React.ReactNode;
  progress?: number;
  progressColor?: string;
}

// LocationButton Props
export interface LocationButtonProps extends BaseButtonProps {
  loading?: boolean;
  loadingText?: string;
  errorText?: string;
  showError?: boolean;
  onLocationSuccess?: (coords: { latitude: number; longitude: number }) => void;
  onLocationError?: (error: Error) => void;
}

// NotificationButton Props
export interface NotificationButtonProps extends BaseButtonProps {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  showDot?: boolean;
  dotColor?: string;
  badgeClassName?: string;
  onNotificationClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

// OutlineButton Props
export interface OutlineButtonProps extends BaseButtonProps {
  outlineWidth?: string;
  outlineOffset?: string;
  outlineColor?: string;
  outlineStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  rounded?: boolean;
  glowing?: boolean;
}

// PaginationButton Props
export interface PaginationButtonProps extends BaseButtonProps {
  page?: number;
  isActive?: boolean;
  isDisabled?: boolean;
  showArrow?: boolean;
  direction?: 'prev' | 'next';
  onPageChange?: (page: number, event: React.MouseEvent<HTMLButtonElement>) => void;
}

// PopoverButton Props
export interface PopoverButtonProps extends BaseButtonProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  arrow?: boolean;
  closeOnClick?: boolean;
  closeOnOutsideClick?: boolean;
}

// PressButton Props
export interface PressButtonProps extends BaseButtonProps {
  pressTime?: number;
  showProgress?: boolean;
  progressColor?: string;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  onPressCancel?: () => void;
}

export interface DropdownItem extends BaseButtonProps {
  id: string;
  // label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
}

// Split Button Types
export interface SplitButtonProps extends BaseButtonProps {
  items: DropdownItem[];
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  menuClassName?: string;
  itemClassName?: string;
  maxHeight?: number;
  closeOnSelect?: boolean;
  showIcons?: boolean;
  loading?: boolean;
  loadingText?: string;
  onMainClick?: () => void;
  mainDisabled?: boolean;
  dropdownDisabled?: boolean;
}

// Status Button Types
export interface StatusButtonProps extends BaseButtonProps {
  // status: 'online' | 'offline' | 'away' | 'busy' | 'custom';
  customColor?: string;
  showDot?: boolean;
  dotClassName?: string;
}

// Swipe Button Types
export interface SwipeButtonProps extends BaseButtonProps {
  threshold?: number;
  onSwipeComplete?: () => void;
  swipeText?: string;
  completeText?: string;
  resetTimeout?: number;
}

// Switch Button Types
export interface SwitchButtonProps extends BaseButtonProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
}

// Theme Toggle Button Types
export interface ThemeToggleButtonProps extends BaseButtonProps {
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

// 3D Button Types
export interface ThreeDButtonProps extends BaseButtonProps {
  pressed?: boolean;
  onClick?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
}

// Toggle Button Types
export interface ToggleButtonProps extends BaseButtonProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
}

// Toolbar Button Types
export interface ToolbarButtonProps extends BaseButtonProps {
  icon?: React.ReactNode;
  tooltip?: string;
  active?: boolean;
}

// Tooltip Button Types
export interface TooltipButtonProps extends BaseButtonProps {
  tooltip: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipDelay?: number;
}

// Upload Button Types
export interface UploadButtonProps extends BaseButtonProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFileSelect?: (files: FileList) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  dragAndDrop?: boolean;
}

// Video Play Button Types
export interface VideoPlayButtonProps extends BaseButtonProps {
  playing?: boolean;
  onPlayPause?: () => void;
  showProgress?: boolean;
  progress?: number;
}

// Voice Command Button Types
export interface VoiceCommandButtonProps extends BaseButtonProps {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
  listening?: boolean;
  processing?: boolean;
}

// Common variant types
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

// Video Play Button
export interface VideoPlayButtonProps extends BaseButtonProps {
  isPlaying?: boolean;
  onPlayPause?: () => void;
  duration?: number;
  currentTime?: number;
  onSeek?: (time: number) => void;
}

// Theme Toggle Button
export interface ThemeToggleButtonProps extends BaseButtonProps {
  theme?: 'light' | 'dark' | 'system';
  // onThemeChange?: (theme: string) => void;
}

// Three D Button
export interface ThreeDButtonProps extends BaseButtonProps {
  // depth?: number;
  pressedDepth?: number;
  color?: string;
  shadowColor?: string;
}

// Toggle Button
export interface ToggleButtonProps extends BaseButtonProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  activeClass?: string;
}

// Toolbar Button
export interface ToolbarButtonProps extends BaseButtonProps {
  active?: boolean;
  tooltip?: string;
  icon?: React.ReactNode;
}

// Tooltip Button
export interface TooltipButtonProps extends BaseButtonProps {
  tooltip: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  tooltipDelay?: number;
}

// Upload Button
export interface UploadButtonProps extends BaseButtonProps {
  onUpload?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  loading?: boolean;
}

// Voice Command Button
export interface VoiceCommandButtonProps extends BaseButtonProps {
  onCommand?: (command: string) => void;
  commands?: string[];
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  state?: 'idle' | 'listening' | 'processing' | 'success' | 'error';
}

// Split Button
export interface SplitButtonProps extends BaseButtonProps {
  options: Array<{ label: string; value: string }>;
  onOptionSelect?: (value: string) => void;
  selectedOption?: string;
  // placement?: 'bottom' | 'top' | 'left' | 'right';
}

// Status Button
export interface StatusButtonProps extends BaseButtonProps {
  status?: 'online' | 'offline' | 'away' | 'busy';
  showIndicator?: boolean;
  indicatorSize?: 'sm' | 'md' | 'lg';
}

// Swipe Button
export interface SwipeButtonProps extends BaseButtonProps {
  onSwipeComplete?: () => void;
  threshold?: number;
  direction?: 'left' | 'right';
  swipeText?: string;
}

// Switch Button
export interface SwitchButtonProps extends BaseButtonProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  thumbColor?: string;
  trackColor?: string;
}
