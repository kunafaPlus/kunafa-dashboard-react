import * as React from "react";
import { cn } from '../../utils/cn'
import { StackPanelProps } from "./types";



const StackPanel = React.forwardRef<HTMLDivElement, StackPanelProps>(
  (
    {
      children,
      direction = "vertical",
      spacing = 4,
      wrap = false,
      alignItems = "start",
      justifyContent = "start",
      dividers = false,
      dividerClassName,
      inline = false,
      reverse = false,
      className,
      ...props
    },
    ref
  ) => {
    const getSpacing = () => {
      if (typeof spacing === "number") {
        return `${spacing * 0.25}rem`;
      }
      return spacing;
    };

    const getAlignItems = () => {
      switch (alignItems) {
        case "start":
          return "items-start";
        case "end":
          return "items-end";
        case "center":
          return "items-center";
        case "stretch":
          return "items-stretch";
        case "baseline":
          return "items-baseline";
        default:
          return "items-start";
      }
    };

    const getJustifyContent = () => {
      switch (justifyContent) {
        case "start":
          return "justify-start";
        case "end":
          return "justify-end";
        case "center":
          return "justify-center";
        case "between":
          return "justify-between";
        case "around":
          return "justify-around";
        case "evenly":
          return "justify-evenly";
        default:
          return "justify-start";
      }
    };

    const renderChildren = () => {
      const childrenArray = React.Children.toArray(children);
      if (!dividers) return children;

      return childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (
            <div
              className={cn(
                "bg-border",
                direction === "horizontal" ? "h-full w-px" : "h-px w-full",
                dividerClassName
              )}
            />
          )}
        </React.Fragment>
      ));
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "horizontal" ? "flex-row" : "flex-col",
          wrap && "flex-wrap",
          reverse && (direction === "horizontal" ? "flex-row-reverse" : "flex-col-reverse"),
          getAlignItems(),
          getJustifyContent(),
          !inline && (direction === "horizontal" ? "w-full" : "h-full"),
          className
        )}
        style={{
          gap: !dividers ? getSpacing() : undefined,
        }}
        {...props}
      >
        {renderChildren()}
      </div>
    );
  }
);

StackPanel.displayName = "StackPanel";

export { StackPanel, type StackPanelProps };
