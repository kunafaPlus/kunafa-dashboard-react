// View Modes
export const VIEW_MODES = {
  DAY: 'day' as const,
  WEEK: 'week' as const,
  MONTH: 'month' as const,
  TIMELINE: 'timeline' as const,
};

// Sort Directions
export const SORT_DIRECTIONS = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
};

// Selection Modes
export const SELECTION_MODES = {
  SINGLE: 'single' as const,
  MULTIPLE: 'multiple' as const,
};

// Field Types
export const FIELD_TYPES = {
  TEXT: 'text' as const,
  NUMBER: 'number' as const,
  BOOLEAN: 'boolean' as const,
  SELECT: 'select' as const,
};

// Event Status
export const EVENT_STATUS = {
  CONFIRMED: 'confirmed' as const,
  TENTATIVE: 'tentative' as const,
  CANCELLED: 'cancelled' as const,
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
};

// Default Values
export const DEFAULTS = {
  ROW_HEIGHT: 48,
  HEADER_HEIGHT: 48,
  OVERSCAN: 5,
  SPREADSHEET_COLUMNS: 5,
  SPREADSHEET_ROWS: 10,
};

// CSS Class Names
export const CLASS_NAMES = {
  // Common
  CUSTOM_TABLE: 'custom-table',
  CUSTOM_HEADER: 'custom-header',
  CUSTOM_BODY: 'custom-body',
  CUSTOM_ROW: 'custom-row',
  CUSTOM_CELL: 'custom-cell',
  
  // Virtual Grid
  CUSTOM_VIRTUAL_GRID: 'custom-virtual-grid',
  
  // Tree
  CUSTOM_TREE: 'custom-tree',
  CUSTOM_NODE: 'custom-node',
  CUSTOM_CONTENT: 'custom-content',
  CUSTOM_TOGGLER: 'custom-toggler',
  
  // Tree Table
  CUSTOM_TREE_TABLE: 'custom-tree-table',
  
  // Kanban
  CUSTOM_KANBAN: 'custom-kanban',
  CUSTOM_COLUMN: 'custom-column',
  CUSTOM_ITEM: 'custom-item',
  
  // Scheduler
  CUSTOM_SCHEDULER: 'custom-scheduler',
  CUSTOM_CONTENT_SCHEDULER: 'custom-content-scheduler',
  CUSTOM_EVENT: 'custom-event',
  
  // Spreadsheet
  CUSTOM_SPREADSHEET: 'custom-spreadsheet',
  CUSTOM_SELECTED_CELL: 'custom-selected-cell',
  
  // PickList
  CUSTOM_PICKLIST: 'custom-picklist',
  CUSTOM_SOURCE: 'custom-source',
  CUSTOM_TARGET: 'custom-target',
};

// Colors
export const COLORS = {
  PRIMARY: '#4CAF50',
  WARNING: '#FF9800',
  INFO: '#2196F3',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
};

// Loading States

