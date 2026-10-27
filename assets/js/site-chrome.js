/* ==========================================================================
   Shared site chrome: <site-header> and <site-footer>
   One source of truth for every public page.

   Usage:
     <site-header current="home" overlay></site-header>
       current  — "home" (Home 1), "home-2", or a key from NAV_ITEMS
       overlay  — header starts transparent over a dark hero
     <site-footer></site-footer>

   Requires assets/js/preferences.js (theme + direction) loaded earlier.
   Loaded as a classic (non-module) script so pages also work when opened
   directly from disk.
   ========================================================================== */
(function () {
  "use strict";

  /* TEMPORARY brand — replace with the studio's final name and logo.
     The two lines are the same name split for the stacked lockup. */
  const BRAND = {
    full: "Aerial Silks & Circus Arts Studio",
    line1: "Aerial Silks &",
    line2: "Circus Arts Studio",
    note: "Temporary name and logo — final studio branding to be confirmed",
  };

  /* Destinations. Pages marked planned do not exist yet; the links are ready
     for when they are built (see README "Build status"). */
  const LINKS = {
    home: "index.html",
    home2: "home-2.html",
    login: "portal/index.html", // planned
    dashboard: "portal/dashboard.html", // planned
    book: "classes.html#timetable", // planned
  };

  /* Footer social profiles. PLACEHOLDERS: fill in each `url` with the studio's
     verified profile address (e.g. "https://www.instagram.com/<handle>/").
     While a url is empty, its icon is shown without a link — no dead or invented links. */
  const SOCIAL_LINKS = [
    { label: "Instagram", url: "", path: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>' },
    { label: "Facebook", url: "", path: '<path d="M14.5 8H17V4.5h-2.5A4 4 0 0 0 10.5 8.5V11H8v3.5h2.5V21H14v-6.5h2.6l.4-3.5h-3V8.8c0-.5.3-.8.5-.8Z"/>' },
    { label: "YouTube", url: "", path: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 4.5 2.5-4.5 2.5Z" fill="currentColor"/>' },
    { label: "TikTok", url: "", path: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6"/>' },
  ];

  const HOME_MENU = [
    { key: "home-1", label: "Home 1", href: LINKS.home },
    { key: "home-2", label: "Home 2", href: LINKS.home2 },
  ];

  const NAV_ITEMS = [
    { key: "about", label: "About", href: "about.html" },
    { key: "classes", label: "Classes", href: "classes.html" },
    { key: "instructors", label: "Instructors", href: "instructors.html" },
    { key: "contact", label: "Contact", href: "contact.html" },
    { key: "dashboard", label: "Dashboard", href: LINKS.dashboard },
  ];

  /* ----------------------------------------------------------------- Icons */
  const icon = {
    arrow: `<svg class="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5"/></svg>`,
    chevron: `<svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2 4.25 4 4 4-4" stroke="currentColor" stroke-width="1.5"/></svg>`,
    sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.25M12 19.25v2.25M2.5 12h2.25M19.25 12h2.25M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg>`,
    moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.2 8.2 0 1 0 20 14.2Z"/></svg>`,
  };

  /* Logo mark (temporary): two silks twisting down from one rigging point.
     Stroke colours are fixed because the mark only appears on stage surfaces. */
  const logoMark = (className) => `
    <svg class="${className}" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
      <circle cx="20" cy="4" r="2.4" fill="#ff5a1f"/>
      <path d="M20 6.5C27 11 27 16 20 20.5S10 28 9 38" stroke="#f2ece3" stroke-width="2.75" stroke-linecap="round"/>
      <path d="M20 6.5C13 11 13 16 20 20.5S30 28 31 38" stroke="#e8566b" stroke-width="2.75" stroke-linecap="round"/>
    </svg>`;

  const brandLink = () => `
    <a href="${LINKS.home}" class="brand" title="${BRAND.note}" aria-label="${BRAND.full} — home">
      ${logoMark("brand-mark")}
      <span class="brand-text" aria-hidden="true">
        <span class="brand-name">${BRAND.line1}</span>
        <span class="brand-sub">${BRAND.line2}</span>
      </span>
    </a>`;

  /* ----------------------------------------------------------- Pref buttons */
  // Header buttons: compact, icon / short text only
  const themeIconButton = () => `
    <button type="button" class="icon-btn" data-theme-toggle aria-pressed="false" aria-label="Dark theme">
      <span class="when-light">${icon.sun}</span><span class="when-dark">${icon.moon}</span>
    </button>`;
  const dirIconButton = (extraClass = "") => `
    <button type="button" class="icon-btn ${extraClass}" data-dir-toggle>
      <span class="sr-only">Text direction:</span>
      <span class="when-ltr">LTR</span><span class="when-rtl">RTL</span>
    </button>`;
  // Menu-panel controls: compact two-option segmented controls (no helper text)
  const segment = (attr, value, content, pressed = "false") =>
    `<button type="button" class="seg-btn" ${attr}="${value}" aria-pressed="${pressed}">${content}</button>`;
  const prefControls = () => `
    <div class="grid grid-cols-1 gap-5 min-[26rem]:grid-cols-2">
      <div role="group" aria-labelledby="pref-theme-label">
        <p id="pref-theme-label" class="eyebrow text-on-stage-muted">Theme</p>
        <div class="seg mt-2">${segment("data-theme-set", "light", `${icon.sun}<span>Light</span>`)}${segment("data-theme-set", "dark", `${icon.moon}<span>Dark</span>`)}</div>
      </div>
      <div role="group" aria-labelledby="pref-dir-label">
        <p id="pref-dir-label" class="eyebrow text-on-stage-muted">Direction</p>
        <div class="seg mt-2">${segment("data-dir-set", "ltr", "<span>LTR</span>")}${segment("data-dir-set", "rtl", "<span>RTL</span>")}</div>
      </div>
    </div>`;

  const navLink = (item, current, cls) =>
    `<a href="${item.href}" class="${cls}"${item.key === current ? ' aria-current="page"' : ""}>${item.label}</a>`;

  /* ------------------------------------------------------------ Disclosure
     A button that shows / hides a list of links. Opens only on click or
     Enter / Space / ArrowDown — never on hover or load. */
  class Disclosure {
    constructor(root) {
      this.root = root;
      this.trigger = root.querySelector("[data-dropdown-trigger]");
      this.panel = root.querySelector("[data-dropdown-panel]");
      this.links = [...this.panel.querySelectorAll("a")];

      this.trigger.addEventListener("click", () => this.toggle());
      this.trigger.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this.open({ focus: "first" });
        }
      });
      this.panel.addEventListener("keydown", (e) => this.onPanelKeydown(e));
      // Following a link leaves the page / section: close behind it
      this.panel.addEventListener("click", (e) => {
        if (e.target.closest("a")) this.close();
      });
    }

    get isOpen() {
      return this.trigger.getAttribute("aria-expanded") === "true";
    }

    open({ focus } = {}) {
      this.panel.hidden = false;
      this.trigger.setAttribute("aria-expanded", "true");
      if (focus === "first") this.links[0].focus();
    }

    close({ restoreFocus = false } = {}) {
      if (!this.isOpen) return;
      const focusInside = this.root.contains(document.activeElement);
      this.panel.hidden = true;
      this.trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus && focusInside) this.trigger.focus();
    }

    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }

    onPanelKeydown(e) {
      const i = this.links.indexOf(document.activeElement);
      let next = null;
      if (e.key === "ArrowDown") next = this.links[(i + 1) % this.links.length];
      else if (e.key === "ArrowUp") next = this.links[(i - 1 + this.links.length) % this.links.length];
      else if (e.key === "Home") next = this.links[0];
      else if (e.key === "End") next = this.links[this.links.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
      }
    }
  }

  /* ---------------------------------------------------------------- Header */
  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;

      this.render();

      this.toggle = this.querySelector(".menu-toggle");
      this.menu = this.querySelector("#mobile-menu");
      this.status = this.querySelector("[data-pref-status]");
      this.disclosures = [...this.querySelectorAll("[data-dropdown]")].map((el) => new Disclosure(el));

      this.toggle.addEventListener("click", () => (this.isOpen ? this.close() : this.open()));
      this.menu.addEventListener("click", (e) => {
        if (e.target.closest("a")) this.close({ restoreFocus: false });
      });
      this.addEventListener("click", (e) => this.onPrefClick(e));
      this.addEventListener("keydown", (e) => this.onKeydown(e));

      // Dropdowns close on outside click / focus leaving, and on Escape
      this.onDocClick = (e) => this.closeDropdownsOutside(e.target);
      this.onDocFocusin = (e) => this.closeDropdownsOutside(e.target);
      this.onDocKeydown = (e) => this.onEscape(e);
      document.addEventListener("click", this.onDocClick);
      document.addEventListener("focusin", this.onDocFocusin);
      document.addEventListener("keydown", this.onDocKeydown);

      // Leaving the compact layout closes everything
      this.desktopQuery = window.matchMedia("(min-width: 80rem)");
      this.desktopQuery.addEventListener("change", () => {
        this.disclosures.forEach((d) => d.close());
        if (this.isOpen) this.close({ restoreFocus: false });
      });

      if (window.StudioPrefs) {
        window.StudioPrefs.onChange(() => this.syncPrefs());
        this.syncPrefs();
      }
      if (this.hasAttribute("overlay")) this.watchScroll();
    }

    disconnectedCallback() {
      document.removeEventListener("click", this.onDocClick);
      document.removeEventListener("focusin", this.onDocFocusin);
      document.removeEventListener("keydown", this.onDocKeydown);
    }

    render() {
      const current = this.getAttribute("current") || "";
      // "home" is Home 1 (index.html); "home-2" is Home 2. Either marks the Home trigger.
      const homeVariant = current === "home" ? "home-1" : current === "home-2" ? "home-2" : "";
      const homeCurrent = homeVariant !== "";

      this.innerHTML = `
        <header class="site-header on-stage">
          <div class="shell flex h-full items-center justify-between gap-3 xl:gap-6">
            ${brandLink()}

            <nav aria-label="Main" class="hidden xl:block">
              <ul class="flex items-center gap-4 2xl:gap-8" role="list">
                <li class="relative" data-dropdown>
                  <button type="button" class="nav-link" data-dropdown-trigger${homeCurrent ? " data-current" : ""}
                    aria-expanded="false" aria-controls="home-menu">
                    Home ${icon.chevron}
                  </button>
                  <ul id="home-menu" class="nav-dropdown" role="list" data-dropdown-panel hidden>
                    ${HOME_MENU.map(
                      (item) => `<li>${navLink(item, homeVariant, "dropdown-link")}</li>`
                    ).join("")}
                  </ul>
                </li>
                ${NAV_ITEMS.map((item) => `<li>${navLink(item, current, "nav-link")}</li>`).join("")}
              </ul>
            </nav>

            <div class="flex items-center gap-2">
              <div class="hidden items-center gap-2 xl:flex">
                ${themeIconButton()}
                ${dirIconButton()}
                <a href="${LINKS.login}" class="nav-link ms-2">Student login</a>
                <a href="${LINKS.book}" class="btn btn-primary btn-sm ms-2 whitespace-nowrap">Book a class</a>
              </div>

              <div class="flex items-center xl:hidden">
                <button type="button"
                  class="menu-toggle relative z-50 -me-2 inline-flex size-11 flex-col items-center justify-center gap-[5px] text-on-stage"
                  aria-expanded="false" aria-controls="mobile-menu">
                  <span class="sr-only">Menu</span>
                  <span class="menu-toggle-bar" aria-hidden="true"></span>
                  <span class="menu-toggle-bar" aria-hidden="true"></span>
                  <span class="menu-toggle-bar" aria-hidden="true"></span>
                </button>
              </div>
            </div>
          </div>
          <p class="sr-only" role="status" data-pref-status></p>
        </header>

        <div id="mobile-menu" class="mobile-menu on-stage xl:hidden" role="dialog" aria-modal="true" aria-label="Site menu" hidden>
          <div class="shell flex flex-1 flex-col pb-8 pt-6">
            <nav aria-label="Main (mobile)">
              <ol class="border-t border-stage-line" role="list">
                <li class="border-b border-stage-line" data-dropdown>
                  <button type="button" class="mobile-nav-link" data-dropdown-trigger${homeCurrent ? " data-current" : ""}
                    aria-expanded="false" aria-controls="home-menu-mobile">
                    <span class="eyebrow font-semibold text-on-stage-muted [font-stretch:100%]" aria-hidden="true">01</span>
                    Home
                    <span class="ms-auto self-center text-on-stage-muted">${icon.chevron}</span>
                  </button>
                  <ul id="home-menu-mobile" class="mobile-sub" role="list" data-dropdown-panel hidden>
                    ${HOME_MENU.map(
                      (item) => `<li>${navLink(item, homeVariant, "mobile-sub-link")}</li>`
                    ).join("")}
                  </ul>
                </li>
                ${NAV_ITEMS.map(
                  (item, i) => `
                  <li class="border-b border-stage-line">
                    <a href="${item.href}" class="mobile-nav-link"${item.key === current ? ' aria-current="page"' : ""}>
                      <span class="eyebrow font-semibold text-on-stage-muted [font-stretch:100%]" aria-hidden="true">0${i + 2}</span>
                      ${item.label}
                    </a>
                  </li>`
                ).join("")}
              </ol>
            </nav>

            <div class="mt-8 border-t border-stage-line pt-6">
              ${prefControls()}
            </div>

            <div class="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
              <a href="${LINKS.book}" class="btn btn-primary btn-lg">Book a class ${icon.arrow}</a>
              <a href="${LINKS.login}" class="btn btn-secondary btn-lg">Student login</a>
            </div>
          </div>
        </div>`;
    }

    /* -------------------------------------------------------- Preferences */
    onPrefClick(e) {
      if (!window.StudioPrefs) return;
      const th = e.target.closest("[data-theme-set]");
      const di = e.target.closest("[data-dir-set]");
      if (th) {
        if (window.StudioPrefs.state().theme !== th.dataset.themeSet) window.StudioPrefs.toggleTheme();
        this.announce(window.StudioPrefs.state().theme === "dark" ? "Dark theme on" : "Light theme on");
        return;
      }
      if (di) {
        if (window.StudioPrefs.state().dir !== di.dataset.dirSet) window.StudioPrefs.toggleDir();
        this.announce(window.StudioPrefs.state().dir === "rtl" ? "Right-to-left layout on" : "Left-to-right layout on");
        return;
      }
      if (e.target.closest("[data-theme-toggle]")) {
        window.StudioPrefs.toggleTheme();
        this.announce(window.StudioPrefs.state().theme === "dark" ? "Dark theme on" : "Light theme on");
      } else if (e.target.closest("[data-dir-toggle]")) {
        window.StudioPrefs.toggleDir();
        this.announce(window.StudioPrefs.state().dir === "rtl" ? "Right-to-left layout on" : "Left-to-right layout on");
      }
    }

    announce(message) {
      if (this.status) this.status.textContent = message;
    }

    syncPrefs() {
      const { theme, dir } = window.StudioPrefs.state();
      this.querySelectorAll("[data-theme-set]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeSet === theme)));
      this.querySelectorAll("[data-dir-set]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.dirSet === dir)));
      this.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
        if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", String(theme === "dark"));
        btn.removeAttribute("title");
      });
      this.querySelectorAll("[data-dir-toggle]").forEach((btn) => {
        if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", String(dir === "rtl"));
        btn.removeAttribute("title");
      });
    }

    /* ----------------------------------------------------------- Dropdowns */
    closeDropdownsOutside(target) {
      this.disclosures.forEach((d) => {
        if (d.isOpen && !d.root.contains(target)) d.close();
      });
    }

    onEscape(e) {
      if (e.key !== "Escape") return;
      // Innermost layer first: an open dropdown, then the mobile menu
      const open = this.disclosures.find((d) => d.isOpen);
      if (open) {
        e.preventDefault();
        open.close({ restoreFocus: true });
      } else if (this.isOpen) {
        e.preventDefault();
        this.close();
      }
    }

    /* --------------------------------------------------------- Mobile menu */
    get isOpen() {
      return this.toggle.getAttribute("aria-expanded") === "true";
    }

    open() {
      this.menu.hidden = false;
      this.toggle.setAttribute("aria-expanded", "true");
      this.toggle.querySelector(".sr-only").textContent = "Close menu";
      this.setAttribute("data-menu-open", "");
      document.documentElement.style.overflow = "hidden";
      const first = this.menu.querySelector("a[href], button");
      if (first) first.focus();
    }

    close({ restoreFocus = true } = {}) {
      this.disclosures.forEach((d) => d.close());
      this.menu.hidden = true;
      this.toggle.setAttribute("aria-expanded", "false");
      this.toggle.querySelector(".sr-only").textContent = "Menu";
      this.removeAttribute("data-menu-open");
      document.documentElement.style.overflow = "";
      if (restoreFocus) this.toggle.focus();
    }

    onKeydown(e) {
      if (!this.isOpen || e.key !== "Tab") return;

      // Keep focus inside the toggle + overlay while the menu is open
      const focusables = [this.toggle, ...this.menu.querySelectorAll("a[href], button")].filter(
        (el) => !el.closest("[hidden]") && el.offsetParent !== null
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    watchScroll() {
      let ticking = false;
      const update = () => {
        this.toggleAttribute("data-scrolled", window.scrollY > 80);
        ticking = false;
      };
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
          }
        },
        { passive: true }
      );
      update();
    }
  }

  /* ---------------------------------------------------------------- Footer */
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;

      const year = new Date().getFullYear();

      // An icon becomes a link only once its verified profile URL is set in SOCIAL_LINKS.
      const social = SOCIAL_LINKS.map(({ label, url, path }) => {
        const glyph = `<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
        const base = "inline-flex size-11 items-center justify-center rounded-full border border-stage-line-strong text-on-stage";
        return url
          ? `<li><a href="${url}" target="_blank" rel="noopener noreferrer" class="${base} transition-colors hover:border-on-stage hover:bg-stage-3" aria-label="${label} (opens in a new tab)">${glyph}</a></li>`
          : `<li><span class="${base}" role="img" aria-label="${label}">${glyph}</span></li>`;
      }).join("");

      // Plain facts only — each is stated on the studio's own pages. No contact details, no links.
      const facts = (items) =>
        `<ul class="mt-4 space-y-2.5" role="list">${items
          .map((t) => `<li class="flex gap-3 type-small text-on-stage"><span class="mt-[0.6em] block h-0.5 w-3 shrink-0 bg-crimson-light" aria-hidden="true"></span><span>${t}</span></li>`)
          .join("")}</ul>`;

      this.innerHTML = `
        <footer class="on-stage bg-stage">
          <div class="shell border-t border-stage-line pt-12 pb-8 lg:pt-14">
            <div class="grid grid-cols-[minmax(0,1fr)] gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

              <div class="sm:col-span-2 lg:col-span-4">
                <div class="flex items-center gap-4">
                  ${logoMark("size-12 shrink-0")}
                  <p class="text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-black uppercase leading-[0.9] [direction:ltr] [font-stretch:62%] rtl:text-right">
                    ${BRAND.line1}<br>${BRAND.line2}
                  </p>
                </div>
                <p class="mt-5 max-w-[26rem] text-on-stage">An aerial silks and circus arts studio, built on strength and expression in equal measure.</p>
              </div>

              <div class="lg:col-span-3">
                <h2 class="eyebrow text-on-stage-muted">The studio</h2>
                ${facts([
                  "Aerial silks is the core discipline",
                  "Training from first climb to performance",
                  "Strength and expression, in equal measure",
                ])}
              </div>

              <div class="lg:col-span-3">
                <h2 class="eyebrow text-on-stage-muted">Good to know</h2>
                ${facts([
                  "Everyone starts low, then builds height",
                  "Technique comes before height",
                  "Progress at your own pace",
                ])}
              </div>

              <div class="sm:col-span-2 lg:col-span-2">
                <h2 class="eyebrow text-on-stage-muted">Follow</h2>
                <ul class="mt-4 grid w-fit grid-cols-4 gap-3 sm:gap-2.5 lg:grid-cols-2" role="list">${social}</ul>
              </div>
            </div>

            <div class="mt-10 flex flex-col gap-2 border-t border-stage-line pt-6 type-caption text-on-stage-muted sm:flex-row sm:items-center sm:justify-between">
              <p>&copy; ${year} ${BRAND.full}. All rights reserved.</p>
            </div>
          </div>
        </footer>`;
    }
  }

  /* ------------------------------------------------------ Scroll-to-top button
     One button per page (this script loads on public pages only). Hidden near
     the top; smooth scroll unless the visitor prefers reduced motion. */
  function initScrollTop() {
    if (document.getElementById("scroll-top")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "scroll-top";
    btn.className = "scroll-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.hidden = true;
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';
    document.body.appendChild(btn);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ticking = false;
    const update = () => {
      ticking = false;
      const show = window.scrollY > 480;
      if (show && btn.hidden) btn.hidden = false;
      btn.toggleAttribute("data-visible", show);
      if (!show) btn.hidden = true;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduce.matches ? "auto" : "smooth" });
      const top = document.getElementById("top");
      if (top) { top.setAttribute("tabindex", "-1"); top.focus({ preventScroll: true }); }
    });
    update();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initScrollTop);
  else initScrollTop();

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
})();
