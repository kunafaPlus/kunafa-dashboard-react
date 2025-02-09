import { useState, useCallback, useEffect } from 'react';

interface UseThemeToggleProps {
  onThemeChange?: (theme: string) => void;
}

export const useThemeToggle = (props?: UseThemeToggleProps) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    }
    return 'system';
  });

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      props?.onThemeChange?.(newTheme);
      return newTheme;
    });
  }, [props]);

  const setThemeWithCallback = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme', newTheme);
    props?.onThemeChange?.(newTheme);
    setTheme(newTheme);
  }, [props]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      updateSystemTheme(media);
    }

    media.addEventListener('change', updateSystemTheme);
    return () => media.removeEventListener('change', updateSystemTheme);
  }, [theme]);

  return { theme, setTheme: setThemeWithCallback, toggleTheme };
};
