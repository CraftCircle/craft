"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/styles/themes";
import { GlobalStyle } from "@/styles/GlobalStyle";

type ThemeMode = "light" | "dark";

const ThemeContext = createContext<{
  mode: ThemeMode;
  toggleTheme: () => void;
}>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setMode(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const currentTheme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <StyledProvider theme={currentTheme}>
        <GlobalStyle />
        {children}
      </StyledProvider>
    </ThemeContext.Provider>
  );
}
