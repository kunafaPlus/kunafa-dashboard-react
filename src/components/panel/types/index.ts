import { VariantProps } from "class-variance-authority"
import { accordionVariants, containerVariants, dividerVariants, drawerOverlayVariants, drawerVariants, scrollAreaVariants, sheetVariants, stepperVariants, tabListVariants, timelineItemVariants, timelineVariants, treeViewVariants } from "../variants"
import { ReactNode } from "react"


export interface AccordionItem {
    title: ReactNode
    content: ReactNode
    disabled?: boolean
    icon?: ReactNode
}

export interface AccordionProps extends VariantProps<typeof accordionVariants> {
    items: AccordionItem[]
    className?: string
    multiple?: boolean
    defaultExpanded?: string[]
    iconPosition?: 'left' | 'right'
}

export interface TabItem {
    label: string
    value: string
    content: ReactNode
    icon?: ReactNode
    disabled?: boolean
}

export interface CustomTabProps extends VariantProps<typeof tabListVariants> {
    items: TabItem[]
    defaultValue?: string
    className?: string
    onChange?: (value: string) => void
}
export interface CardPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  media?: {
    type: "image" | "video";
    src: string;
    alt?: string;
    aspectRatio?: "square" | "video" | "wide" | string;
  };
  hover?: boolean;
  loading?: boolean;
  variant?: "default" | "bordered";
  size?: "sm" | "md" | "lg";
}
export interface CollapsiblePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  defaultExpanded?: boolean;
  direction?: "horizontal" | "vertical";
  headerClassName?: string;
  contentClassName?: string;
  chevronClassName?: string;
}

export interface ContainerProps extends VariantProps<typeof containerVariants> {
    children: ReactNode
    className?: string
    as?: keyof JSX.IntrinsicElements
}
export interface CustomCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
  }
  export interface DividerProps extends VariantProps<typeof dividerVariants> {
    className?: string
    children?: ReactNode
    withLabel?: boolean
}
export type DockPosition = "left" | "right" | "top" | "bottom";

export interface DockPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultPosition?: DockPosition;
  defaultDocked?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  onPositionChange?: (position: DockPosition) => void;
  onDockedChange?: (docked: boolean) => void;
  showClose?: boolean;
  onClose?: () => void;
}
export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open?: boolean;
  onClose?: () => void;
  showOverlay?: boolean;
  overlayVariant?: VariantProps<typeof drawerOverlayVariants>["variant"];
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}
export interface FloatingPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  resizable?: boolean;
  draggable?: boolean;
  onClose?: () => void;
  snapPoints?: Array<{ x: number; y: number }>;
  snapThreshold?: number;
}

export interface ExpansionPanelItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (expanded: boolean) => void;
}

export interface ExpansionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<ExpansionPanelItemProps> | React.ReactElement<ExpansionPanelItemProps>[];
  multiple?: boolean;
  defaultExpandedItems?: number[];
  onChange?: (expandedItems: number[]) => void;
}
export interface GridPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { [key: string]: number };
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  autoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
  autoRows?: string;
  autoColumns?: string;
  templateRows?: string;
  templateColumns?: string;
  alignItems?: "start" | "end" | "center" | "stretch";
  justifyItems?: "start" | "end" | "center" | "stretch";
  alignContent?: "start" | "end" | "center" | "stretch" | "space-between" | "space-around";
  justifyContent?: "start" | "end" | "center" | "stretch" | "space-between" | "space-around";
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number | { [key: string]: number };
  rowSpan?: number | { [key: string]: number };
  colStart?: number | "auto";
  colEnd?: number | "auto";
  rowStart?: number | "auto";
  rowEnd?: number | "auto";
}
export interface GroupPanelProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  badge?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  variant?: "default" | "bordered";
  size?: "sm" | "md" | "lg";
  onCollapseChange?: (collapsed: boolean) => void;
}
export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: {
    width?: number | string;
    height?: number | string;
  };
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  resizeHandles?: Array<"n" | "e" | "s" | "w" | "ne" | "se" | "sw" | "nw">;
  grid?: number;
  preserveAspectRatio?: boolean;
  onResize?: (size: { width: number; height: number }) => void;
  onResizeStart?: () => void;
  onResizeEnd?: (size: { width: number; height: number }) => void;
}
export interface ScrollAreaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scrollAreaVariants> {
  viewportRef?: React.RefObject<HTMLDivElement>;
  scrollbarSize?: number;
  hideScrollbar?: boolean;
}
export interface SheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  open?: boolean;
  onClose?: () => void;
}

export interface SidePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "left" | "right";
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  defaultCollapsed?: boolean;
  autoCollapse?: boolean;
  collapsedWidth?: number;
  showToggle?: boolean;
  onWidthChange?: (width: number) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}
export interface StackPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  spacing?: number | string;
  wrap?: boolean;
  alignItems?: "start" | "end" | "center" | "stretch" | "baseline";
  justifyContent?: "start" | "end" | "center" | "between" | "around" | "evenly";
  dividers?: boolean;
  dividerClassName?: string;
  inline?: boolean;
  reverse?: boolean;
}

export interface Step {
    title: string
    description?: string
    icon?: ReactNode
    optional?: boolean
    completed?: boolean
    content?: ReactNode // محتوى الخطوة
}

export interface StepperProps extends VariantProps<typeof stepperVariants> {
    steps: Step[]
    activeStep: number
    className?: string
    onChange?: (step: number) => void
    children?: ReactNode // محتوى عام (اختياري)
}

// تعريف الخصائص للمكونات
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean; // إضافة خاصية لتعطيل التبويب
}
export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  date?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: VariantProps<typeof timelineItemVariants>["variant"];
  dotClassName?: string;
}

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  items: TimelineItem[];
  lineColor?: string;
  dotSize?: "sm" | "md" | "lg";
  lineStyle?: "solid" | "dashed";
}

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  children?: TreeNode[];
  icon?: React.ReactNode;
}

export interface TreeViewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof treeViewVariants> {
  data: TreeNode[];
  defaultExpanded?: string[];
  onNodeSelect?: (nodeId: string) => void;
  selectedNode?: string;
  expandOnSelect?: boolean;
}

