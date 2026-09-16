import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Mirrors Theme.kt's SalahAppTheme(themeIndex: 0/1/2 = System/Light/Dark). Kept as strings here
// rather than Android's indices -- this is internal storage, not exported content.
export const THEME_CHOICES = ["system", "light", "dark"];

const STORAGE_KEY = "salah-theme";

function getInitialChoice() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (THEME_CHOICES.includes(stored)) return stored;
  } catch {
    // localStorage unavailable (private mode, etc.) -- fall through to the default.
  }
  return "system";
}

function setStoredChoice(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Nothing to persist to -- the explicit choice just won't survive a reload.
  }
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [choice, setChoiceState] = useState(getInitialChoice);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemDark(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const isDark = choice === "system" ? systemDark : choice === "dark";

  useEffect(() => {
    // :root is the dark palette (see styles.css), so only light needs an attribute at all.
    if (isDark) {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = "light";
    }
    // index.html's <meta name="theme-color"> is a static default (matching :root's own default,
    // dark) for before this runs; keep the installed-PWA/browser-chrome color in sync with
    // whichever theme actually resolved, the same background --salah-bg gives the page itself.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--salah-bg").trim();
  }, [isDark]);

  const setChoice = useCallback((next) => {
    setStoredChoice(next);
    setChoiceState(next);
  }, []);

  const value = useMemo(() => ({ choice, setChoice, isDark }), [choice, setChoice, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
