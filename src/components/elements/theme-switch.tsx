"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setTheme as setReduxTheme } from "@/store/slices/themeSlice";
import type { Theme } from "@/types";
import { Avatar } from "../ui/avatar";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync theme changes with Redux
  useEffect(() => {
    if (mounted && theme) {
      dispatch(setReduxTheme(theme as Theme));
    }
  }, [theme, dispatch, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <Avatar onClick={() => setTheme(theme == "dark" ? "light" : "dark")}>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Avatar>
  );
}
