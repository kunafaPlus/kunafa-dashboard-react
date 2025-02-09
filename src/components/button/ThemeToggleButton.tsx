import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, themeToggleButtonVariants } from "./variants";
import { ThemeToggleButtonProps } from "./types";
import { useThemeToggle } from "./hooks/useThemeToggle";
import { BiMoon, BiSun } from "react-icons/bi";
import { CiMonitor } from "react-icons/ci";

const ThemeToggleButton = React.forwardRef<HTMLButtonElement, ThemeToggleButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "icon",
      showIcon = true,
      showText = false,
      onThemeChange,
      children,
      ...props
    },
    ref
  ) => {
    const { theme, setTheme } = useThemeToggle();

    const icons = {
      light: <BiSun className="h-[1.2rem] w-[1.2rem]" />,
      dark: <BiMoon className="h-[1.2rem] w-[1.2rem]" />,
      system: <CiMonitor className="h-[1.2rem] w-[1.2rem]" />
    };

    const texts = {
      light: "Light",
      dark: "Dark",
      system: "System"
    };

    const handleClick = () => {
      const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const currentIndex = modes.indexOf(theme);
      const nextTheme = modes[(currentIndex + 1) % modes.length];
      setTheme(nextTheme);
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant, size }),
          themeToggleButtonVariants({ showIcon, showText }),
          "relative",
          className
        )}
        {...props}
      >
        {showIcon && icons[theme]}
        {showText && (
          <span className={cn("ml-2", !showIcon && "ml-0")}>
            {texts[theme]}
          </span>
        )}
      </button>
    );
  }
);

ThemeToggleButton.displayName = "ThemeToggleButton";

export { ThemeToggleButton };
export default ThemeToggleButton;
