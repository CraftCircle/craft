"use client";
import { useThemeMode } from "@/provider/theme-provider";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "transparent",
        border: "2px solid currentColor",
        padding: "0.4rem 1rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      {mode === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
