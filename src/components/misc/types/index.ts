import { VariantProps } from "class-variance-authority";
import { alertVariants, breadcrumbSeparatorVariants, breadcrumbVariants, commandVariants, contextMenuItemVariants, contextMenuVariants, menuVariants, paginationVariants, skeletonVariants, sortableVariants, tagStyles } from "../variants";
import { ReactNode } from "react";
import { tooltipVariants } from "../Tooltip";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  separatorVariant?: VariantProps<typeof breadcrumbSeparatorVariants>["variant"];
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}
export 

interface CommandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandVariants> {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  filter?: (value: string, search: string) => boolean;
}

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onSelect?: () => void;
}
 
export interface ContextMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof contextMenuVariants> {
  trigger: React.ReactNode;
}

export interface ContextMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof contextMenuItemVariants> {
  icon?: React.ReactNode;
  shortcut?: string;
}

export interface CustomAlertProps extends VariantProps<typeof alertVariants> {
    className?: string;
    children?: ReactNode;
    icon?: ReactNode;
    title?: string;
    onClose?: () => void;
    showIcon?: boolean;
    message?: string;
    type?: 'error' | 'info' | 'success' | 'warning';
}

export interface CustomTagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagStyles> {
  label?: string;
  icon?: React.ReactNode;
}
export 
interface MenuItem {
    label: string
    icon?: ReactNode
    onClick?: () => void
    disabled?: boolean
    danger?: boolean
    divider?: boolean
    href?: string
    items?: MenuItem[]
}

export interface MenuProps extends VariantProps<typeof menuVariants> {
    trigger: ReactNode
    items: MenuItem[]
    className?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    offset?: number
}
export 
interface PaginationProps extends VariantProps<typeof paginationVariants> {
    className?: string
    total: number
    perPage?: number
    currentPage?: number
    siblingCount?: number
    onChange?: (page: number) => void
    showFirstLast?: boolean
    showPrevNext?: boolean
    disabled?: boolean
}
export interface PopoverProps
 {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  modal?: boolean;
  placement?: string;
  className?: string;
  size?: string;
  variant?: string;
  content?:React.ReactNode
  children?:React.ReactNode
}
export interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
    className?: string
    width?: string | number
    height?: string | number
    circle?: boolean
}
export interface SortableItem {
  id: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface SortableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sortableVariants> {
  items: SortableItem[];
  onChange?: (items: SortableItem[]) => void;
  handle?: boolean;
  animation?: boolean;
  itemClassName?: string;
  columns?: number;
  renderItem?: (item: SortableItem) => React.ReactNode;
}
export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  position?:string
  delay?:number
}
export interface VirtualListProps<T>
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof virtualListVariants> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  scrollToIndex?: number;
}
export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  position?:string
  delay?:number
}