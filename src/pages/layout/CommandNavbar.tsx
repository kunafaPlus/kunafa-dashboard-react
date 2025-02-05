import * as React from "react";
import { cn } from "../../utils/cn";
import { navbarVariants } from "./variants";
import type { VariantProps } from "class-variance-authority";
import { Command, Command as CommandPrimitive } from "cmdk";
import { BiHelpCircle, BiLogOut, BiMenu, BiSearch, BiX } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";


interface CommandItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  shortcut?: string;
  section?: string;
  onClick?: () => void;
}

interface CommandNavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  logo?: React.ReactNode;
  commands?: CommandItem[];
  rightContent?: React.ReactNode;
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
  shortcut?: string;
  placeholder?: string;
}

const CommandNavbar = React.forwardRef<HTMLElement, CommandNavbarProps>(
  (
    {
      logo,
      commands = [],
      rightContent,
      variant,
      size,
      position,
      padding,
      border,
      mobileBreakpoint = "md",
      shortcut = "⌘K",
      placeholder = "Type a command or search...",
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };

      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);

    const sections = React.useMemo(() => {
      const sectionMap = new Map<string, CommandItem[]>();
      commands.forEach((command) => {
        const section = command.section || "General";
        if (!sectionMap.has(section)) {
          sectionMap.set(section, []);
        }
        sectionMap.get(section)?.push(command);
      });
      return Array.from(sectionMap.entries());
    }, [commands]);

    return (
      <>
        <nav
          ref={ref}
          className={cn(navbarVariants({ variant, size, position, padding, border }), className)}
          {...props}
        >
          {/* Logo */}
          {logo && <div className="flex-shrink-0">{logo}</div>}

          {/* Command Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "ml-8 flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              `hidden ${mobileBreakpoint}:flex`
            )}
          >
            <BiSearch className="h-4 w-4" />
            <span>Search or run command</span>
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              {shortcut}
            </kbd>
          </button>

          {/* Right Content */}
          {rightContent && (
            <div className={`hidden ${mobileBreakpoint}:flex ml-auto`}>
              {rightContent}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${mobileBreakpoint}:hidden ml-auto rounded-md p-2 hover:bg-accent hover:text-accent-foreground`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <BiX className="h-6 w-6" />
            ) : (
              <BiMenu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              className={`${mobileBreakpoint}:hidden absolute left-0 right-0 top-full bg-background border-b p-4 shadow-lg`}
            >
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <BsSearch className="h-4 w-4" />
                <span>Search or run command</span>
              </button>
              {rightContent && (
                <div className="mt-4 border-t pt-4">{rightContent}</div>
              )}
            </div>
          )}
        </nav>

        {/* Command Dialog */}
        {open && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-popover p-4 shadow-lg">
              <CommandPrimitive
                className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
              >
                <div className="flex items-center border-b px-3">
                  <Command className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandPrimitive.Input
                    value={inputValue}
                    onValueChange={setInputValue}
                    placeholder={placeholder}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <CommandPrimitive.List className="max-h-[300px] overflow-y-auto p-2">
                  {sections.map(([section, items]) => (
                    <React.Fragment key={section}>
                      <CommandPrimitive.Group
                        heading={
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            {section}
                          </div>
                        }
                      >
                        {items.map((item) => (
                          <CommandPrimitive.Item
                            key={item.id}
                            onSelect={() => {
                              item.onClick?.();
                              setOpen(false);
                            }}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          >
                            {item.icon && (
                              <span className="mr-2">{item.icon}</span>
                            )}
                            <span>{item.label}</span>
                            {item.shortcut && (
                              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                {item.shortcut}
                              </kbd>
                            )}
                          </CommandPrimitive.Item>
                        ))}
                      </CommandPrimitive.Group>
                    </React.Fragment>
                  ))}

                  {inputValue && !sections.some(([, items]) => items.length > 0) && (
                    <p className="p-4 text-center text-sm text-muted-foreground">
                      No results found.
                    </p>
                  )}
                </CommandPrimitive.List>
              </CommandPrimitive>
            </div>
          </div>
        )}
      </>
    );
  }
);

CommandNavbar.displayName = "CommandNavbar";

// Example commands
const defaultCommands: CommandItem[] = [
  {
    id: "settings",
    icon: <CiSettings className="h-4 w-4" />,
    label: "Settings",
    shortcut: "⌘,",
    section: "General",
    onClick: () => console.log("Settings clicked"),
  },
  {
    id: "help",
    icon: <BiHelpCircle className="h-4 w-4" />,
    label: "Help",
    shortcut: "?",
    section: "General",
    onClick: () => console.log("Help clicked"),
  },
  {
    id: "logout",
    icon: <BiLogOut className="h-4 w-4" />,
    label: "Logout",
    section: "Account",
    onClick: () => console.log("Logout clicked"),
  },
];

export { CommandNavbar, type CommandNavbarProps, type CommandItem, defaultCommands };
