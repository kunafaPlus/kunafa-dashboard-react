  // Basic Types
export interface Item {
  id: number;
  name: string;
  age?: number;
  email?: string;
  description?: string;
  isActive?: boolean;
  department?: string;
}

// Column Types
export interface Column<T> {
  field: keyof T | string;
  header: string;
  width?: number;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'boolean' | 'select';
  options?: { label: string; value: string }[];
  validation?: (value: any) => string | undefined;
  body?: (item: T) => React.ReactNode;
  render?: (value: any) => React.ReactNode;
  exportable?: boolean;
}

// Tree Types
export interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  data?: any;
}

export interface TreeTableNode {
  key: string;
  data: {
    name: string;
    value: number;
    [key: string]: any;
  };
  children?: TreeTableNode[];
}

export interface TreeTableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  body?: (node: TreeTableNode) => React.ReactNode;
}

// Organization Chart Types
export interface OrgChartNode {
  key: string;
  label: string;
  type?: string;
  expanded?: boolean;
  children?: OrgChartNode[];
  data?: any;
  icon?: React.ReactNode;
}

// Kanban Types
export interface KanbanItem {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  items: KanbanItem[];
}

// Scheduler Types
export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  color?: string;
  description?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface Resource {
  id: string;
  title: string;
}

// Spreadsheet Types
export interface Cell {
  value: string;
  formula?: string;
}

// Common Types
export type SortDirection = 'asc' | 'desc';
export type SelectionMode = 'single' | 'multiple';
export type ViewMode = 'day' | 'week' | 'month' | 'timeline';

// Event Handler Types
export interface SortEvent<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface SelectionEvent<T> {
  selectedItems: T[];
}

export interface DragEndEvent {
  source: { columnId: string; index: number };
  destination: { columnId: string; index: number };
  itemId: string;
}

export interface ExpandEvent {
  keys: string[];
}

// Component Props Types
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (event: SortEvent<T>) => void;
  onSelectionChange?: (event: SelectionEvent<T>) => void;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export interface EditableDataGridProps<T> extends DataTableProps<T> {
  onDataChange: (data: T[]) => void;
  onCellChange: (item: T, field: keyof T, value: any) => void;
  onValidationError: (error: string) => void;
}

export interface VirtualDataGridProps<T> extends DataTableProps<T> {
  rowHeight: number;
  headerHeight: number;
  overscan?: number;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
  emptyTemplate?: React.ReactNode;
  onRowClick?: (item: T) => void;
}

export interface TreeTableProps {
  value: TreeTableNode[];
  columns: TreeTableColumn[];
  selectionMode?: SelectionMode;
  selectedKeys?: string[];
  expandedKeys?: string[];
  onSelectionChange?: (event: ExpandEvent) => void;
  onExpand?: (event: ExpandEvent) => void;
  onSort?: (event: { field: string; order: SortDirection }) => void;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export interface OrganizationChartProps {
  value: OrgChartNode;
  selectionMode?: SelectionMode;
  selection?: OrgChartNode[];
  onSelectionChange?: (nodes: OrgChartNode[]) => void;
  onNodeClick?: (node: OrgChartNode) => void;
  onNodeExpand?: (node: OrgChartNode) => void;
  onNodeCollapse?: (node: OrgChartNode) => void;
  nodeTemplate?: (node: OrgChartNode) => React.ReactNode;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  onDragEnd: (result: DragEndEvent) => void;
  className?: string;
  columnClassName?: string;
  itemClassName?: string;
}

export interface SchedulerProps {
  events: SchedulerEvent[];
  resources: Resource[];
  onEventClick?: (event: SchedulerEvent) => void;
  onEventChange?: (event: SchedulerEvent, start: Date, end: Date) => void;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: ViewMode) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  eventClassName?: string;
}

export interface SpreadsheetGridProps {
  data: Cell[][];
  columns: number;
  rows: number;
  onChange?: (data: Cell[][]) => void;
  onCellChange?: (row: number, col: number, cell: Cell) => void;
  className?: string;
  cellClassName?: string;
  headerClassName?: string;
  selectedCellClassName?: string;
}

export interface PickListProps<T> {
  source: T[];
  target: T[];
  onChange: (event: { source: T[]; target: T[] }) => void;
  onSourceItemClick?: (item: T) => void;
  onTargetItemClick?: (item: T) => void;
  itemTemplate?: (item: T) => React.ReactNode;
  className?: string;
  sourceClassName?: string;
  targetClassName?: string;
  itemClassName?: string;
  filter?: boolean;
  filterPlaceholder?: string;
}
