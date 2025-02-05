import * as React from "react";
import { cn } from "../../utils/cn";
import {
  sidebarVariants,
  sidebarItemVariants,
  sidebarSectionVariants,
} from "./sidebarVariants";
import type { VariantProps } from "class-variance-authority";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";

interface SidebarItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SimpleSidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sidebarVariants> {
  sections?: SidebarSection[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showCollapseButton?: boolean;
  itemVariant?: VariantProps<typeof sidebarItemVariants>["variant"];
  sectionPadding?: VariantProps<typeof sidebarSectionVariants>["padding"];
  sectionSpacing?: VariantProps<typeof sidebarSectionVariants>["spacing"];
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SimpleSidebar = React.forwardRef<HTMLElement, SimpleSidebarProps>(
  (
    {
      sections = [],
      header,
      footer,
      variant,
      size,
      position,
      mobile,
      collapsible = false,
      defaultCollapsed = false,
      showCollapseButton = true,
      itemVariant = "default",
      sectionPadding = "default",
      sectionSpacing = "default",
      onCollapsedChange,
      className,
      ...props
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const [activeItem, setActiveItem] = React.useState<string>();

    React.useEffect(() => {
      const path = window.location.pathname;
      const active = sections
        .flatMap((section) => section.items)
        .find((item) => item.href === path);
      if (active) {
        setActiveItem(active.id);
      }
    }, [sections]);

    const handleCollapse = () => {
      const newCollapsed = !collapsed;
      setCollapsed(newCollapsed);
      onCollapsedChange?.(newCollapsed);
    };

    const handleItemClick = (item: SidebarItem) => {
      if (!item.disabled) {
        setActiveItem(item.id);
        item.onClick?.();
      }
    };

    return (
      <>
        {/* Backdrop for mobile */}
        {mobile && !collapsed && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        )}

        {/* Sidebar */}
        <aside
          ref={ref}
          className={cn(sidebarVariants({ variant, size, position, mobile, collapsed }), className)}
          {...props}
        >
          {/* Header */}
          {header && (
            <div
              className={cn(
                "flex items-center border-b",
                collapsed ? "justify-center p-2" : "justify-between p-4"
              )}
            >
              {!collapsed && header}
              {collapsible && showCollapseButton && (
                <button
                  type="button"
                  onClick={handleCollapse}
                  className="rounded-lg p-1.5 hover:bg-accent hover:text-accent-foreground"
                >
                  {collapsed ? (
                    <BiChevronRight className="h-5 w-5" />
                  ) : (
                    <BiChevronLeft className="h-5 w-5" />
                  )}
                </button>
              )}
              {mobile && !collapsed && (
                <button
                  type="button"
                  onClick={handleCollapse}
                  className="rounded-lg p-1.5 hover:bg-accent hover:text-accent-foreground lg:hidden"
                >
                  <BiX className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Sections */}
          <div
            className={cn(
              "flex-1 overflow-y-auto",
              sidebarSectionVariants({ padding: sectionPadding, spacing: sectionSpacing })
            )}
          >
            {sections.map((section, index) => (
              <div key={index} className="space-y-2">
                {section.title && !collapsed && (
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeItem === item.id;
                    return item.href ? (
                      <a
                        key={item.id}
                        href={item.href}
                        className={cn(
                          sidebarItemVariants({
                            variant: itemVariant,
                            active: isActive,
                            disabled: item.disabled,
                            collapsed,
                          })
                        )}
                        onClick={() => handleItemClick(item)}
                      >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                      </a>
                    ) : (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(
                          sidebarItemVariants({
                            variant: itemVariant,
                            active: isActive,
                            disabled: item.disabled,
                            collapsed,
                          }),
                          "w-full"
                        )}
                        onClick={() => handleItemClick(item)}
                        disabled={item.disabled}
                      >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {footer && (
            <div
              className={cn(
                "border-t",
                collapsed ? "p-2 text-center" : "p-4"
              )}
            >
              {footer}
            </div>
          )}
        </aside>
      </>
    );
  }
);

SimpleSidebar.displayName = "SimpleSidebar";

export { SimpleSidebar, type SimpleSidebarProps, type SidebarItem, type SidebarSection };
