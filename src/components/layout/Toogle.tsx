"use client";

import { useEffect, useState } from "react";

export default function Toogle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Retrieve theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (systemPrefersDark) {
      setTheme("dark");
      document.documentElement.classList.toggle("dark", true);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  if (!mounted) {
    // Return a beautiful empty placeholder during server hydration to prevent layout shift
    return (
      <div className="w-14 h-7 rounded-full bg-surface-200/50 dark:bg-surface-800/50 animate-pulse border border-surface-200/30" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-0.5 cursor-pointer flex items-center justify-between bg-surface-200 dark:bg-surface-800 border border-surface-300/40 dark:border-surface-700/40 transition-colors duration-500 ease-apex-expo shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 group"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Visual background elements */}
      <span className="absolute left-1.5 opacity-80 dark:opacity-20 transition-opacity duration-300">
        <svg className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
        </svg>
      </span>
      <span className="absolute right-1.5 opacity-20 dark:opacity-80 transition-opacity duration-300">
        <svg className="w-3.5 h-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Sliding thumb */}
      <div
        className={`w-6 h-6 rounded-full bg-white dark:bg-surface-950 shadow-md flex items-center justify-center transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          theme === "dark" ? "translate-x-7" : "translate-x-0"
        } group-hover:scale-105 group-active:scale-95 z-10`}
      >
        {theme === "light" ? (
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-4.95a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zm1.414 8.486a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM9 17a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-6-8a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm2.293 4.707a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM17 9a1 1 0 00-1 1h-1a1 1 0 100 2h1a1 1 0 001-1zm-2.293-4.707a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </div>
    </button>
  );
}
