import * as React from "react";
import { cn } from "../../utils/cn";
import { BreadcrumbProps, BreadcrumbItem } from "./types";
import { breadcrumbItemVariants, breadcrumbSeparatorVariants, breadcrumbVariants } from "./variants";

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      variant,
      size,
      items,
      separator = "/",
      separatorVariant = "default",
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      onItemClick,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Function to determine which items to render based on expansion state
    const renderItems = () => {
      if (!maxItems || items.length <= maxItems || isExpanded) {
        return items;
      }

      const beforeItems = items.slice(0, itemsBeforeCollapse);
      const afterItems = items.slice(-itemsAfterCollapse);

      return [
        ...beforeItems,
        { label: "..." },
        ...afterItems,
      ];
    };

    const itemsToRender = renderItems();

    return (
      <nav
        ref={ref}
        className={cn(breadcrumbVariants({ variant, size }), className)}
        aria-label="breadcrumb"
        {...props}
      >
        {itemsToRender.map((item, index) => {
          const isLast = index === itemsToRender.length - 1;
          const isCollapsed = item.label === "...";

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  breadcrumbItemVariants({
                    variant: isLast ? "active" : item.href ? "link" : "default",
                  }),
                  "flex items-center"
                )}
                {...(isCollapsed
                  ? {
                      role: "button",
                      onClick: () => setIsExpanded(true),
                      className: cn(
                        breadcrumbItemVariants({ variant: "link" }),
                        "cursor-pointer"
                      ),
                    }
                  : {
                      ...(item.href && !isLast
                        ? {
                            as: "a",
                            href: item.href,
                            onClick: (e: React.MouseEvent) => {
                              e.preventDefault();
                              onItemClick?.(item, index);
                            },
                          }
                        : {})
                    })}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </div>
              {!isLast && (
                <span
                  className={cn(
                    breadcrumbSeparatorVariants({ variant: separatorVariant }),
                    "select-none"
                  )}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb, type BreadcrumbItem };

// Variants for breadcrumb items
