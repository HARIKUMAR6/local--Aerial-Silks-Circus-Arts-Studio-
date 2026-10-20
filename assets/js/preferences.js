/* ==========================================================================
   Display preferences: colour theme (light | dark) and text direction (ltr | rtl)

   Loaded synchronously in <head> so both are applied before first paint.
   - Theme: saved choice, otherwise the system colour-scheme preference.
   - Direction: saved choice, otherwise ltr.
   Storage is optional; every read/write is guarded so the site still works
   when it is blocked (private windows, strict browser settings).

   API (window.StudioPrefs): state(), toggleTheme(), toggleDir(), onChange(fn)
   ========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const KEYS = { theme: "studio-theme", dir: "studio-dir" };
  const systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const listeners = [];

  const read = (key) => {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  };
  const write = (key, value) => {
    try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  };

  const savedTheme = () => {
    const value = read(KEYS.theme);
    return value === "light" || value === "dark" ? value : null;
  };
  const savedDir = () => {
    const value = read(KEYS.dir);
    return value === "rtl" || value === "ltr" ? value : null;
  };

  const state = () => ({
    theme: root.getAttribute("data-theme") === "dark" ? "dark" : "light",
    dir: root.getAttribute("dir") === "rtl" ? "rtl" : "ltr",
  });

  const apply = ({ theme, dir }) => {
    if (theme) root.setAttribute("data-theme", theme);
    if (dir) root.setAttribute("dir", dir);
    listeners.forEach((fn) => fn(state()));
  };

  const setTheme = (theme) => {
    write(KEYS.theme, theme);
    apply({ theme });
  };
  const setDir = (dir) => {
    write(KEYS.dir, dir);
    apply({ dir });
  };

  // Initial state, applied immediately
  root.classList.add("js");
  root.setAttribute("data-theme", savedTheme() || (systemDark && systemDark.matches ? "dark" : "light"));
  root.setAttribute("dir", savedDir() || "ltr");

  // Follow the system setting only while the visitor has not chosen a theme
  if (systemDark) {
    systemDark.addEventListener("change", (e) => {
      if (!savedTheme()) apply({ theme: e.matches ? "dark" : "light" });
    });
  }

  // Keep other open tabs in step
  window.addEventListener("storage", (e) => {
    if (e.key === KEYS.theme && (e.newValue === "light" || e.newValue === "dark")) apply({ theme: e.newValue });
    if (e.key === KEYS.dir && (e.newValue === "ltr" || e.newValue === "rtl")) apply({ dir: e.newValue });
  });

  window.StudioPrefs = {
    state,
    toggleTheme: () => setTheme(state().theme === "dark" ? "light" : "dark"),
    toggleDir: () => setDir(state().dir === "rtl" ? "ltr" : "rtl"),
    onChange: (fn) => listeners.push(fn),
  };
})();
