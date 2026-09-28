"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
      className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
    >
      <Moon className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
