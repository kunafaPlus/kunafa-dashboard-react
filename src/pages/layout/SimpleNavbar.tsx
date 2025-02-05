import * as React from "react";
import { cn } from "../../utils/cn";
import { navbarVariants, navLinkVariants } from "./variants";
import type { VariantProps } from "class-variance-authority";
import { BiMenu, BiX } from "react-icons/bi";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SimpleNavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  logo?: React.ReactNode;
  items?: NavItem[];
  rightContent?: React.ReactNode;
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
  linkVariant?: VariantProps<typeof navLinkVariants>["variant"];
  linkSize?: VariantProps<typeof navLinkVariants>["size"];
}

const SimpleNavbar = React.forwardRef<HTMLElement, SimpleNavbarProps>(
  (
    {
      logo,
      items = [],
      rightContent,
      variant,
      size,
      position,
      padding,
      border,
      mobileBreakpoint = "md",
      linkVariant = "default",
      linkSize = "default",
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState<string>();

    React.useEffect(() => {
      const path = window.location.pathname;
      const active = items.find((item) => item.href === path);
      if (active) {
        setActiveItem(active.href);
      }
    }, [items]);

    return (
      <nav
        ref={ref}
        className={cn(
          navbarVariants({ variant, size, position, padding, border }),
          className
        )}
        {...props}
      >
        {/* Logo */}
        {logo && <div className="flex-shrink-0">{logo}</div>}

        {/* Desktop Navigation */}
        <div className={`hidden ${mobileBreakpoint}:flex ml-8 gap-1`}>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                navLinkVariants({
                  variant: linkVariant,
                  size: linkSize,
                  active: activeItem === item.href,
                })
              )}
              onClick={() => setActiveItem(item.href)}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Content */}
        {rightContent && (
          <div className={`hidden ${mobileBreakpoint}:flex ml-auto`}>
            {rightContent}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${mobileBreakpoint}:hidden ml-auto rounded-md p-2 hover:bg-accent hover:text-accent-foreground`}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <BiX className="h-6 w-6" />
          ) : (
            <BiMenu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`${mobileBreakpoint}:hidden absolute left-0 right-0 top-full bg-background border-b p-4 shadow-lg`}>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    navLinkVariants({
                      variant: linkVariant,
                      size: linkSize,
                      active: activeItem === item.href,
                    })
                  )}
                  onClick={() => {
                    setActiveItem(item.href);
                    setIsOpen(false);
                  }}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </a>
              ))}
            </div>
            {rightContent && (
              <div className="mt-4 border-t pt-4">{rightContent}</div>
            )}
          </div>
        )}
      </nav>
    );
  }
);

SimpleNavbar.displayName = "SimpleNavbar";

export { SimpleNavbar, type SimpleNavbarProps, type NavItem };
