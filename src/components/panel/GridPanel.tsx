import * as React from "react";
import { cn } from '../../utils/cn'
import { GridItemProps, GridPanelProps } from "./types";



const GridPanel = React.forwardRef<HTMLDivElement, GridPanelProps>(
  (
    {
      children,
      columns = 12,
      gap = 4,
      rowGap,
      columnGap,
      autoFlow,
      autoRows,
      autoColumns,
      templateRows,
      templateColumns,
      alignItems,
      justifyItems,
      alignContent,
      justifyContent,
      className,
      ...props
    },
    ref
  ) => {
    const getResponsiveColumns = () => {
      if (typeof columns === "number") {
        return `grid-template-columns: repeat(${columns}, minmax(0, 1fr));`;
      }

      return Object.entries(columns)
        .map(([breakpoint, value]) => {
          if (breakpoint === "default") {
            return `grid-template-columns: repeat(${value}, minmax(0, 1fr));`;
          }
          return `@media (min-width: ${breakpoint}) {
            grid-template-columns: repeat(${value}, minmax(0, 1fr));
          }`;
        })
        .join(" ");
    };

    const gridStyles = {
      display: "grid",
      gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap,
      rowGap: rowGap && (typeof rowGap === "number" ? `${rowGap * 0.25}rem` : rowGap),
      columnGap: columnGap && (typeof columnGap === "number" ? `${columnGap * 0.25}rem` : columnGap),
      gridAutoFlow: autoFlow,
      gridAutoRows: autoRows,
      gridAutoColumns: autoColumns,
      gridTemplateRows: templateRows,
      gridTemplateColumns: templateColumns || getResponsiveColumns(),
      alignItems,
      justifyItems,
      alignContent,
      justifyContent,
    };

    return (
      <div
        ref={ref}
        className={cn("grid", className)}
        style={gridStyles as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      children,
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      className,
      ...props
    },
    ref
  ) => {
    const getResponsiveSpan = (span: number | { [key: string]: number }) => {
      if (typeof span === "number") {
        return `span ${span}`;
      }

      return Object.entries(span)
        .map(([breakpoint, value]) => {
          if (breakpoint === "default") {
            return `span ${value}`;
          }
          return `@media (min-width: ${breakpoint}) {
            grid-column: span ${value};
          }`;
        })
        .join(" ");
    };

    const itemStyles = {
      gridColumn: colSpan && getResponsiveSpan(colSpan),
      gridRow: rowSpan && getResponsiveSpan(rowSpan),
      gridColumnStart: colStart,
      gridColumnEnd: colEnd,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={itemStyles as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridPanel.displayName = "GridPanel";
GridItem.displayName = "GridItem";

export { GridPanel, GridItem, type GridPanelProps, type GridItemProps };
