import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  sidebarItemVariants,
  sidebarSectionVariants,
  sidebarVariants,
} from "./sidebarVariants";
import { cn } from "../../utils/cn";

interface SubMenuItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface MenuItem extends SubMenuItem {
  description?: string;
  children?: SubMenuItem[];
  badge?: React.ReactNode;
}

interface SidebarSection {
  id: string;
  title?: string;
  items: MenuItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface AdvancedSidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sidebarVariants> {
  sections?: SidebarSection[];
  sidebarHeight?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showCollapseButton?: boolean;
  itemVariant?: VariantProps<typeof sidebarItemVariants>["variant"];
  sectionPadding?: VariantProps<typeof sidebarSectionVariants>["padding"];
  sectionSpacing?: VariantProps<typeof sidebarSectionVariants>["spacing"];
  onCollapsedChange?: (collapsed: boolean) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const AdvancedSidebar = React.forwardRef<HTMLElement, AdvancedSidebarProps>(
  (
    {
      sections = [],
      header,
      sidebarHeight,
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
      showSearch = false,
      searchPlaceholder = "Search...",
      className,
      ...props
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const [activeItem, setActiveItem] = React.useState<string>();
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
      new Set(sections.filter((s) => s.defaultExpanded).map((s) => s.id))
    );
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
      new Set()
    );
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleCollapse = () => {
      const newCollapsed = !collapsed;
      setCollapsed(newCollapsed);
      onCollapsedChange?.(newCollapsed);
      if (newCollapsed) {
        setExpandedItems(new Set());
      }
    };

    const toggleSection = (sectionId: string) => {
      setExpandedSections((prev) => {
        const next = new Set(prev);
        if (next.has(sectionId)) {
          next.delete(sectionId);
        } else {
          next.add(sectionId);
        }
        return next;
      });
    };

    const toggleItem = (itemId: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
    };

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      if (!searchQuery) return items;
      return items
        .map((item) => ({
          ...item,
          children: item.children?.filter(
            (child: any) =>
              child.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (child.description &&
                child.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (item.children && item.children.length > 0)
        );
    };

    React.useEffect(() => {
      const path = window.location.pathname;
      const active = sections
        .flatMap((section) => section.items)
        .flatMap((item) => [item, ...(item.children || [])])
        .find((item) => item.href === path);
      if (active) {
        setActiveItem(active.id); // استخدم item.id بدلاً من item.href
      }
    }, [sections]);

    const handleItemClick = (item: MenuItem | SubMenuItem) => {
      if (!item.disabled) {
        setActiveItem(item.id); // استخدم item.id بدلاً من item.href
        item.onClick?.();
      }
    };

    const renderMenuItem = (item: MenuItem | SubMenuItem, isChild = false) => {
      const isActive = activeItem === item.id; // استخدم item.id بدلاً من item.href
      const hasChildren =
        "children" in item && item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);

      return (
        <div key={item.href} className="">
          {item.href ? (
            <Link
              to={item.href}
              className={cn(
                "group flex items-center gap-x-2 rounded-md px-4 py-2 text-sm transition-all duration-200",
                !collapsed &&
                  "hover:bg-gray-700 hover:text-white hover:shadow-sm",
                isActive ? "bg-gray-700 px-4 text-white shadow-sm" : "text-gray-300", // Highlight active item
                item.disabled && "pointer-events-none opacity-50",
                isChild && "ml-4"
              )}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && (
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center",
                    !collapsed && "group-hover:text-white",
                    isActive && "text-white"
                  )}
                >
                  {item.icon}
                </span>
              )}
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <div>
                    <span className="inline-block truncate">{item.label}</span>
                    {"description" in item && item.description && (
                      <p className="truncate text-xs text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {"badge" in item && item.badge}
                </div>
              )}
            </Link>
          ) : (
            <button
              type="button"
              className={cn(
                "group flex w-full items-center gap-x-2 rounded-md px-4 py-2 text-sm transition-all duration-200",
                !collapsed &&
                  "hover:bg-gray-700 hover:text-white hover:shadow-sm",
                isActive ? "bg-gray-800 text-white shadow-sm" : "text-gray-300", // Highlight active item
                item.disabled && "pointer-events-none opacity-50",
                isChild && "ml-4"
              )}
              onClick={() => {
                handleItemClick(item);
                if (hasChildren) toggleItem(item.id);
              }}
            >
              {item.icon && (
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center",
                    !collapsed && "group-hover:text-white",
                    isActive && "text-white"
                  )}
                >
                  {item.icon}
                </span>
              )}
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <div>
                    <span className="inline-block truncate">{item.label}</span>
                    {"description" in item && item.description && (
                      <p className="truncate text-xs text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {hasChildren && (
                    <FaChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        isExpanded ? "rotate-180" : ""
                      )}
                    />
                  )}
                  {"badge" in item && item.badge}
                </div>
              )}
            </button>
          )}
          {hasChildren && isExpanded && !collapsed && (
            <div className="mt-1 space-y-1">
              {(item as MenuItem).children?.map((child) =>
                renderMenuItem(child, true)
              )}
            </div>
          )}
        </div>
      );
    };
    return (
      <>
        {/* Backdrop for mobile */}
        {mobile && !collapsed && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        )}
        <PerfectScrollbar>
          {/* Sidebar */}
          <aside
            ref={ref}
            className={cn(
              "no-scrollbar fixed top-0 left-0 flex-col bg-gray-900",
              "shadow-lg shadow-black/20",
              "relative z-20",
              "overflow-y-auto",
              sidebarVariants({ variant, size, position, collapsed }), // Pass collapsed state
              collapsed && "collapsed-sidebar",
              className
            )}
            style={
              sidebarHeight ? { height: sidebarHeight } : { height: "98vh" }
            }
            {...props}
          >
            {/* Header */}
            {header && (
              <div className="flex h-[60px] items-center px-4 py-2 shadow-sm">
                <div className="flex-1 overflow-hidden">
                  {!collapsed && (
                    <div className="transition-all duration-200">{header}</div>
                  )}
                </div>
                {collapsible && showCollapseButton && (
                  <button
                    onClick={handleCollapse}
                    className="ml-2 rounded-md p-2 hover:bg-gray-700 hover:text-white hover:shadow-sm transition-all duration-200"
                  >
                    {collapsed ? (
                      <FaChevronRight size={18} />
                    ) : (
                      <FaChevronLeft size={18} />
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Sections */}
            <div className="flex-1 overflow-auto">
              {sections.map((section, index) => {
                const filteredItems = filterItems(section.items);
                if (filteredItems.length === 0) return null;

                return (
                  <div
                    key={index}
                    className={cn(
                      "py-2",
                      sidebarSectionVariants({
                        padding: sectionPadding,
                        spacing: sectionSpacing,
                      })
                    )}
                  >
                    {section.title && !collapsed && (
                      <div
                        className={cn(
                          "mb- px-4 text-xs font-medium uppercase text-gray-400",
                          section.collapsible &&
                            "cursor-pointer hover:text-white"
                        )}
                        onClick={() =>
                          section.collapsible && toggleSection(section.id)
                        }
                      >
                        <div className="flex items-center justify-between">
                          {section.title}
                          {section.collapsible && (
                            <FaChevronDown
                              size={14}
                              className={cn(
                                "transition-transform duration-200",
                                expandedSections.has(section.id)
                                  ? "rotate-180"
                                  : ""
                              )}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {(!section.collapsible ||
                      expandedSections.has(section.id)) &&
                      filteredItems.map((item) => renderMenuItem(item))}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            {footer && (
              <div className="mt-auto px-4 py-2 shadow-sm">
                {!collapsed && (
                  <div className="transition-all duration-200">{footer}</div>
                )}
              </div>
            )}
          </aside>
        </PerfectScrollbar>
      </>
    );
  }
);

AdvancedSidebar.displayName = "AdvancedSidebar";

export {
  AdvancedSidebar,
  type AdvancedSidebarProps,
  type MenuItem,
  type SubMenuItem,
  type SidebarSection,
};
