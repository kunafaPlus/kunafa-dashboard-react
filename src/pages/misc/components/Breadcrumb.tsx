import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const breadcrumbVariants = cva("flex items-center space-x-1", {
  variants: {
    variant: {
      default: "",
      bordered: "p-2 border rounded-md",
      ghost: "bg-muted/50 p-2 rounded-md",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const breadcrumbItemVariants = cva(
  "inline-flex items-center hover:text-foreground",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        active: "font-semibold text-foreground",
        link: "text-primary hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const breadcrumbSeparatorVariants = cva("mx-2 text-muted-foreground", {
  variants: {
    variant: {
      default: "",
      arrow: "font-bold",
      slash: "text-muted-foreground/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps
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
                  : {})}
                {...(item.href && !isLast
                  ? {
                      as: "a",
                      href: item.href,
                      onClick: (e: React.MouseEvent) => {
                        e.preventDefault();
                        onItemClick?.(item, index);
                      },
                    }
                  : {})}
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
