import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

import { cn } from '../../utils/cn';

import { navbarVariants, navLinkVariants } from './variants';

interface NavSubItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavSubItem[];
}

interface NavGroup {
  title: string;
  items: NavSubItem[];
}

interface MegaFaBarsContent {
  groups?: NavGroup[];
  featured?: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
}

interface NavItemWithMega extends NavItem {
  megaFaBars?: MegaFaBarsContent;
}

interface AdvancedNavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  logo?: React.ReactNode;
  items?: NavItemWithMega[];
  rightContent?: React.ReactNode;
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  linkVariant?: VariantProps<typeof navLinkVariants>['variant'];
  linkSize?: VariantProps<typeof navLinkVariants>['size'];
  hideOnScroll?: boolean;
}

const AdvancedNavbar = React.forwardRef<HTMLElement, AdvancedNavbarProps>(
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
      mobileBreakpoint = 'lg',
      linkVariant = 'default',
      linkSize = 'default',
      hideOnScroll = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState<string>();
    const [openDropdown, setOpenDropdown] = React.useState<string>();
    const [isVisible, setIsVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
      const path = window.location.pathname;
      const active = items.find(
        (item) => item.href === path || item.children?.some((child) => child.href === path)
      );
      if (active) {
        setActiveItem(active.href);
      }
    }, [items]);

    React.useEffect(() => {
      if (!hideOnScroll) return;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setIsVisible(currentScrollY <= lastScrollY.current || currentScrollY < 50);
        lastScrollY.current = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => { window.removeEventListener('scroll', handleScroll); };
    }, [hideOnScroll]);

    const handleDropdownClick = (label: string) => {
      setOpenDropdown(openDropdown === label ? undefined : label);
    };

    const renderDropdownContent = (item: NavItemWithMega) => {
      if (item.megaFaBars) {
        return (
          <div className="grid grid-cols-4 gap-6 p-6">
            <div className="col-span-3 grid grid-cols-3 gap-6">
              {item.megaFaBars.groups?.map((group, index) => (
                <div key={index}>
                  <h3 className="font-medium text-foreground mb-3">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={subItem.href}
                          className={cn(
                            navLinkVariants({
                              variant: linkVariant,
                              size: 'sm',
                              active: activeItem === subItem.href,
                            })
                          )}
                          onClick={() => {
                            setActiveItem(subItem.href);
                            setOpenDropdown(undefined);
                          }}
                        >
                          {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                          <div>
                            <div>{subItem.label}</div>
                            {subItem.description && (
                              <p className="text-sm text-muted-foreground">{subItem.description}</p>
                            )}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {item.megaFaBars.featured && (
              <div className="col-span-1">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={item.megaFaBars.featured.image}
                    alt={item.megaFaBars.featured.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 bg-muted">
                    <h3 className="font-medium text-foreground">
                      {item.megaFaBars.featured.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.megaFaBars.featured.description}
                    </p>
                    <a
                      href={item.megaFaBars.featured.link}
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Learn more →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      return (
        <ul className="py-2">
          {item.children?.map((child, index) => (
            <li key={index}>
              <a
                href={child.href}
                className={cn(
                  navLinkVariants({
                    variant: linkVariant,
                    size: linkSize,
                    active: activeItem === child.href,
                  }),
                  'block'
                )}
                onClick={() => {
                  setActiveItem(child.href);
                  setOpenDropdown(undefined);
                }}
              >
                {child.icon && <span className="mr-2">{child.icon}</span>}
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      );
    };

    return (
      <nav
        ref={ref}
        className={cn(
          navbarVariants({ variant, size, position, padding, border }),
          !isVisible && 'transform -translate-y-full',
          className
        )}
        {...props}
      >
        {/* Logo */}
        {logo && <div className="flex-shrink-0">{logo}</div>}

        {/* Desktop Navigation */}
        <div className={`hidden ${mobileBreakpoint}:flex ml-8 gap-1`}>
          {items.map((item) => {
            const hasDropdown = item.children || item.megaFaBars;
            return (
              <div key={item.label} className="relative">
                {item.href ? (
                  <a
                    href={item.href}
                    className={cn(
                      navLinkVariants({
                        variant: linkVariant,
                        size: linkSize,
                        active: activeItem === item.href,
                      })
                    )}
                    onClick={() => { setActiveItem(item.href); }}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={cn(
                      navLinkVariants({
                        variant: linkVariant,
                        size: linkSize,
                      }),
                      'gap-1'
                    )}
                    onClick={() => { handleDropdownClick(item.label); }}
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                    <FaChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        openDropdown === item.label && 'rotate-180'
                      )}
                    />
                  </button>
                )}
                {hasDropdown && openDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
                    {renderDropdownContent(item)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Content */}
        {rightContent && (
          <div className={`hidden ${mobileBreakpoint}:flex ml-auto`}>{rightContent}</div>
        )}

        {/* Mobile FaBars Button */}
        <button
          type="button"
          onClick={() => { setIsOpen(!isOpen); }}
          className={`${mobileBreakpoint}:hidden ml-auto rounded-md p-2 hover:bg-accent hover:text-accent-foreground`}
          aria-label="Toggle FaBars"
        >
          {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className={`${mobileBreakpoint}:hidden absolute left-0 right-0 top-full max-h-[calc(100vh-4rem)] overflow-auto bg-background border-b shadow-lg`}
          >
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.label} className="py-2">
                  {item.href ? (
                    <a
                      href={item.href}
                      className={cn(
                        navLinkVariants({
                          variant: linkVariant,
                          size: linkSize,
                          active: activeItem === item.href,
                        }),
                        'block px-4'
                      )}
                      onClick={() => {
                        setActiveItem(item.href);
                        setIsOpen(false);
                      }}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </a>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={cn(
                          navLinkVariants({
                            variant: linkVariant,
                            size: linkSize,
                          }),
                          'flex w-full items-center justify-between px-4'
                        )}
                        onClick={() => { handleDropdownClick(item.label); }}
                      >
                        <span className="flex items-center">
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.label}
                        </span>
                        <FaChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            openDropdown === item.label && 'rotate-180'
                          )}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="mt-2 bg-accent/50 px-4 py-2">
                          {item.children?.map((child) => (
                            <a
                              key={child.href}
                              href={child.href}
                              className={cn(
                                navLinkVariants({
                                  variant: linkVariant,
                                  size: 'sm',
                                  active: activeItem === child.href,
                                }),
                                'block py-2'
                              )}
                              onClick={() => {
                                setActiveItem(child.href);
                                setIsOpen(false);
                              }}
                            >
                              {child.icon && <span className="mr-2">{child.icon}</span>}
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            {rightContent && <div className="border-t p-4">{rightContent}</div>}
          </div>
        )}
      </nav>
    );
  }
);

AdvancedNavbar.displayName = 'AdvancedNavbar';

export {
  AdvancedNavbar,
  type AdvancedNavbarProps,
  type NavItem,
  type NavSubItem,
  type NavGroup,
  type MegaFaBarsContent,
  type NavItemWithMega,
};
