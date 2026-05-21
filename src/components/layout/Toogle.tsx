"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

/**
 * Theme Toggle Component
 * 
 * Behavior:
 * 1. On first visit with NO saved preference → checks system/device preference
 *    - If device prefers dark mode → starts in dark mode
 *    - If device prefers light mode (or no preference) → starts in light mode
 * 2. On subsequent visits → restores the user's last chosen theme from localStorage
 * 3. User can toggle between light/dark at any time via the button
 * 4. If the user changes their OS/device theme while the site is open AND has no
 *    saved manual override, the site follows the OS change automatically
 */
export default function Toogle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Apply theme to the DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, []);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (savedTheme) {
      // User has a manually saved preference — respect it
      applyTheme(savedTheme);
    } else if (systemDarkQuery.matches) {
      // No saved preference but device/OS prefers dark → auto-switch to dark
      applyTheme("dark");
    } else {
      // No saved preference, no system dark preference → start in light
      applyTheme("light");
    }

    // Listen for live OS theme changes (e.g. user toggles dark mode in system settings)
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only auto-follow if the user hasn't manually set a preference
      const currentSaved = localStorage.getItem("theme");
      if (!currentSaved) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    systemDarkQuery.addEventListener("change", handleSystemChange);
    return () => systemDarkQuery.removeEventListener("change", handleSystemChange);
  }, [applyTheme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  if (!mounted) {
    // Hydration placeholder — prevents layout shift during SSR
    return (
      <div className="w-14 h-7 rounded-full bg-surface-200/50 dark:bg-surface-700/50 animate-pulse border border-surface-200/30 dark:border-surface-600/30" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full p-0.5 cursor-pointer
        flex items-center
        transition-all duration-500 ease-apex-expo
        shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50
        group
        ${isDark
          ? "bg-gradient-to-r from-indigo-900 to-slate-800 border border-indigo-500/30"
          : "bg-gradient-to-r from-amber-100 to-sky-100 border border-amber-200/60"
        }
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Currently in ${theme} mode. Click to switch.`}
    >
      {/* Background decorative sun icon (visible in light mode) */}
      <span
        className={`absolute left-1.5 transition-all duration-500 ${
          isDark ? "opacity-0 scale-50 rotate-90" : "opacity-70 scale-100 rotate-0"
        }`}
      >
        <svg
          className="w-3.5 h-3.5 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Background decorative moon icon (visible in dark mode) */}
      <span
        className={`absolute right-1.5 transition-all duration-500 ${
          isDark ? "opacity-70 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
        }`}
      >
        <svg
          className="w-3.5 h-3.5 text-indigo-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Sliding thumb with icon */}
      <div
        className={`
          w-6 h-6 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-500 ease-apex-expo z-10
          group-hover:scale-110 group-active:scale-95
          ${isDark
            ? "translate-x-7 bg-slate-900 shadow-indigo-500/20"
            : "translate-x-0 bg-white shadow-amber-300/30"
          }
        `}
      >
        {/* Sun icon inside thumb (light mode) */}
        <svg
          className={`w-3.5 h-3.5 text-amber-500 absolute transition-all duration-300 ${
            isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-4.95a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zm1.414 8.486a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM9 17a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-6-8a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm2.293 4.707a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM17 9a1 1 0 00-1 1h-1a1 1 0 100 2h1a1 1 0 001-1zm-2.293-4.707a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>

        {/* Moon icon inside thumb (dark mode) */}
        <svg
          className={`w-3.5 h-3.5 text-indigo-400 absolute transition-all duration-300 ${
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </button>
  );
}
