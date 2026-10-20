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
  // Mobile-menu buttons: full labels with a visible state
  const themeMenuButton = () => `
    <button type="button" class="pref-btn" data-theme-toggle aria-pressed="false">
      <span>Dark theme</span>
      <span class="pref-state" aria-hidden="true">
        <span class="when-light">${icon.sun}</span><span class="when-dark">${icon.moon}</span>
        <span class="when-light">Off</span><span class="when-dark">On</span>
      </span>
    </button>`;
  const dirMenuButton = () => `
    <button type="button" class="pref-btn" data-dir-toggle aria-pressed="false">
      <span>Right-to-left</span>
      <span class="pref-state" aria-hidden="true">
        <span class="when-ltr">LTR</span><span class="when-rtl">RTL</span>
      </span>
    </button>`;

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

              <div class="flex items-center gap-2 xl:hidden">
                ${themeIconButton()}
                ${dirIconButton("hidden min-[24rem]:inline-flex")}
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

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              ${themeMenuButton()}
              ${dirMenuButton()}
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
      this.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
        if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", String(theme === "dark"));
        btn.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
      });
      this.querySelectorAll("[data-dir-toggle]").forEach((btn) => {
        if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", String(dir === "rtl"));
        btn.title = dir === "rtl" ? "Switch to left-to-right layout" : "Switch to right-to-left layout";
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
      const ph = (text) => `<span class="ph">${text}</span>`;
      const footLink = (href, label) =>
        `<li><a href="${href}" class="inline-flex min-h-11 items-center text-on-stage no-underline hover:text-crimson-light hover:underline hover:underline-offset-4">${label}</a></li>`;

      this.innerHTML = `
        <footer class="on-stage bg-stage">
          <div class="shell border-t border-stage-line pt-16 pb-10 lg:pt-24">
            <div class="grid gap-12 lg:grid-cols-12 lg:gap-8">

              <div class="lg:col-span-5">
                <a href="${LINKS.home}" class="inline-flex items-center gap-4 text-on-stage no-underline" aria-label="${BRAND.full} — home">
                  ${logoMark("size-14 shrink-0 sm:size-16")}
                  <span class="text-[clamp(2rem,1.2rem+3.5vw,3.75rem)] font-black uppercase leading-[0.88] [direction:ltr] [font-stretch:62%] rtl:text-right" aria-hidden="true">
                    ${BRAND.line1}<br>${BRAND.line2}
                  </span>
                </a>
                <p class="mt-5">${ph("Temporary name &amp; logo — TBC")}</p>
                <a href="${LINKS.book}" class="btn btn-primary mt-8">Book a class ${icon.arrow}</a>
              </div>

              <nav aria-label="Footer" class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
                <div>
                  <h2 class="eyebrow text-on-stage-muted">Explore</h2>
                  <ul class="mt-4" role="list">
                    ${footLink(LINKS.home, "Home")}
                    ${NAV_ITEMS.filter((item) => item.key !== "dashboard").map((item) => footLink(item.href, item.label)).join("")}
                  </ul>
                </div>
                <div>
                  <h2 class="eyebrow text-on-stage-muted">Students</h2>
                  <ul class="mt-4" role="list">
                    ${footLink(LINKS.login, "Student login")}
                    ${footLink(LINKS.dashboard, "Dashboard")}
                    ${footLink(LINKS.book, "Book a class")}
                    ${footLink("classes.html", "Find your level")}
                  </ul>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <h2 class="eyebrow text-on-stage-muted">Visit</h2>
                  <address class="mt-4 space-y-3 not-italic type-small text-on-stage-muted">
                    <p>${ph("Studio address — TBC")}</p>
                    <p>${ph("Opening hours — TBC")}</p>
                    <p>${ph("Phone — TBC")}</p>
                    <p>${ph("Email — TBC")}</p>
                  </address>
                  <h2 class="eyebrow mt-8 text-on-stage-muted">Follow</h2>
                  <p class="mt-3">${ph("Social channels — TBC")}</p>
                </div>
              </nav>
            </div>

            <div class="mt-16 flex flex-col gap-4 border-t border-stage-line pt-6 type-caption text-on-stage-muted md:flex-row md:items-center md:justify-between">
              <p>&copy; ${year} ${BRAND.full} (temporary name). Placeholder photography from Unsplash and Pexels, used under their free licences.</p>
              <ul class="flex flex-wrap items-center gap-x-6 gap-y-2" role="list">
                <li>${ph("Privacy policy — TBC")}</li>
                <li>${ph("Terms — TBC")}</li>
                <li><a href="#top" class="inline-flex min-h-11 items-center text-on-stage underline underline-offset-4 hover:text-crimson-light">Back to top</a></li>
              </ul>
            </div>
          </div>
        </footer>`;
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
})();
