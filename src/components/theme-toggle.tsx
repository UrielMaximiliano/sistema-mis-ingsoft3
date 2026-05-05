"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return <div className="size-9" />;
  }

  return (
    <button
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      className="inline-flex size-9 items-center justify-center rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
      onClick={toggle}
      style={{
        background: dark ? "var(--bg-elevated)" : "var(--bg-inset)",
        border: `1px solid var(--border-primary)`,
        color: "var(--text-secondary)",
      }}
      type="button"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
