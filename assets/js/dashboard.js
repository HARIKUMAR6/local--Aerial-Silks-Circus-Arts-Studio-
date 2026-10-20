/* ==========================================================================
   Student dashboard — FRONTEND DEMO with SAMPLE DATA
   - No backend, account, API or authentication. Nothing is fetched or sent.
   - All state lives in memory for this page view; a reload resets it.
   - Only the site's existing theme/direction preference is persisted (as on
     every other page); no member data is stored anywhere.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------- Sample data */
  const day = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const at = (offsetDays, h, m) => new Date(today.getTime() + offsetDays * day + (h * 60 + m) * 60000);

  const TYPES = ["Technique", "Conditioning", "Open practice"];
  const CLASSES = [
    { when: at(1, 18, 30), title: "Silks foundations", type: "Technique", length: "75 min", note: "Climbs, foot locks and a first wrap." },
    { when: at(3, 10, 0), title: "Grip & core", type: "Conditioning", length: "45 min", note: "Hanging holds, tucks and pulling strength." },
    { when: at(5, 19, 0), title: "Linking sequences", type: "Technique", length: "75 min", note: "Joining two wraps into one phrase." },
    { when: at(8, 17, 0), title: "Open practice", type: "Open practice", length: "60 min", note: "Your own repetition time on the apparatus." },
    { when: at(10, 18, 30), title: "Flexibility for aerial", type: "Conditioning", length: "45 min", note: "Splits, shoulders and active range." },
    { when: at(-2, 18, 30), title: "Silks foundations", type: "Technique", length: "75 min", note: "Foot locks and a basic stand." },
    { when: at(-5, 10, 0), title: "Grip & core", type: "Conditioning", length: "45 min", note: "Hanging holds." },
    { when: at(-9, 17, 0), title: "Open practice", type: "Open practice", length: "60 min", note: "Repeating the stand and descent." },
  ];
  const STAGES = [
    { key: "discover", name: "Discover", skills: [["Basic climb", true], ["Foot lock", true], ["Seated hold", true], ["Controlled descent", false]] },
    { key: "develop", name: "Develop", skills: [["Hip key", true], ["Single-leg wrap", false], ["Inversion from the floor", false], ["Linking two moves", false]] },
    { key: "refine", name: "Refine", skills: [["Inversion in the air", false], ["Short drop", false], ["Choreographed phrase", false]] },
  ];
  const ACTIVITY = [
    { when: at(-2, 20, 0), kind: "class", text: "Attended Silks foundations" },
    { when: at(-3, 9, 0), kind: "milestone", text: "Reached: Hip key" },
    { when: at(-5, 11, 0), kind: "class", text: "Attended Grip & core" },
    { when: at(-7, 18, 0), kind: "practice", text: "Logged 30 minutes of practice" },
    { when: at(-9, 18, 0), kind: "class", text: "Attended Open practice" },
    { when: at(-12, 19, 0), kind: "milestone", text: "Completed the Discover stage foundations" },
    { when: at(-14, 18, 0), kind: "practice", text: "Logged 20 minutes of stretching" },
  ];

  const state = { period: "upcoming", type: "all", activity: "all" };

  /* --------------------------------------------------------------- Helpers */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const locale = () => document.documentElement.lang || "en";
  const fmtDay = (d) => d.toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "short" });
  const fmtTime = (d) => d.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" });
  const pct = (s) => Math.round((s.skills.filter(([, done]) => done).length / s.skills.length) * 100);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------ Navigation */
  const VIEWS = [
    { id: "overview", label: "Overview", icon: '<path d="M4 13h6V4H4zm10 7h6v-9h-6zM4 20h6v-4H4zm10-11h6V4h-6z"/>' },
    { id: "schedule", label: "Schedule", icon: '<rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 10h17M8 3v4m8-4v4"/>' },
    { id: "progress", label: "Progress", icon: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H3"/>' },
    { id: "activity", label: "Activity", icon: '<path d="M3 12h4l3-7 4 14 3-7h4"/>' },
    { id: "preferences", label: "Preferences", icon: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3m0 13v3M2.5 12h3m13 0h3M5.3 5.3l2.1 2.1m9.2 9.2 2.1 2.1m0-13.4-2.1 2.1m-9.2 9.2-2.1 2.1"/>' },
  ];
  const svg = (p, cls) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  $('[data-nav="side"]').innerHTML = VIEWS.map((v) => `<li><a class="app-nav-link" href="#${v.id}" data-nav-link="${v.id}">${svg(v.icon, "size-5")}${v.label}</a></li>`).join("");
  $('[data-nav="menu"]').innerHTML = VIEWS.map((v) => `<li><a class="app-nav-link" href="#${v.id}" data-nav-link="${v.id}">${svg(v.icon, "size-5")}${v.label}</a></li>`).join("");

  function show(id, moveFocus) {
    if (!VIEWS.some((v) => v.id === id)) id = "overview";
    $$("[data-view]").forEach((s) => (s.hidden = s.dataset.view !== id));
    $$("[data-nav-link]").forEach((a) => (a.dataset.navLink === id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    document.title = `${VIEWS.find((v) => v.id === id).label} — Dashboard`;
    if (moveFocus) { $(`#v-${id}`).focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  window.addEventListener("hashchange", () => show(location.hash.slice(1), true));

  /* --------------------------------------------------------------- Overview */
  function renderOverview() {
    const upcoming = CLASSES.filter((c) => c.when > Date.now()).sort((a, b) => a.when - b.when);
    const doneSkills = STAGES.reduce((n, s) => n + s.skills.filter(([, d]) => d).length, 0);
    const allSkills = STAGES.reduce((n, s) => n + s.skills.length, 0);
    const stats = [
      ["Classes this month", CLASSES.filter((c) => c.when < Date.now()).length],
      ["Upcoming", upcoming.length],
      ["Skills reached", `${doneSkills}/${allSkills}`],
      ["Practice logged", "50 min"],
    ];
    $("[data-stats]").innerHTML = stats
      .map(([k, v]) => `<div class="bg-paper p-4 sm:p-5"><dt class="type-small text-muted">${k}</dt><dd class="mt-1 text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] font-extrabold leading-none tabular-nums [font-stretch:75%]">${v}</dd></div>`)
      .join("");

    $("[data-next-classes]").innerHTML = upcoming.slice(0, 3)
      .map((c) => `<li class="flex items-center justify-between gap-4 py-3"><div class="min-w-0"><p class="font-semibold">${c.title}</p><p class="type-small text-muted">${fmtDay(c.when)} · ${fmtTime(c.when)} · ${c.length}</p></div><span class="badge badge-proposed shrink-0">${c.type}</span></li>`)
      .join("");

    const current = STAGES.find((s) => pct(s) < 100) || STAGES[STAGES.length - 1];
    const p = pct(current);
    $("[data-stage-summary]").innerHTML = `
      <div class="relative size-24 shrink-0" role="img" aria-label="${current.name} stage: ${p}% of skills reached">
        <svg viewBox="0 0 36 36" class="size-24 -rotate-90"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-line)" stroke-width="3.5"/>
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-crimson)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${(p / 100) * 97.4} 97.4"/></svg>
        <span class="absolute inset-0 flex items-center justify-center text-xl font-extrabold tabular-nums" aria-hidden="true">${p}%</span>
      </div>
      <div><p class="type-h3">${current.name}</p><p class="type-small text-muted">${current.skills.filter(([, d]) => d).length} of ${current.skills.length} skills reached</p></div>`;
  }

  /* --------------------------------------------------------------- Schedule */
  $("[data-type-filters]").innerHTML = ["all", ...TYPES]
    .map((t) => `<button type="button" class="chip" aria-pressed="${t === "all"}" data-type="${t}">${t === "all" ? "All types" : t}</button>`)
    .join("");

  function renderSchedule() {
    const now = Date.now();
    const list = CLASSES
      .filter((c) => (state.period === "upcoming" ? c.when > now : c.when <= now))
      .filter((c) => state.type === "all" || c.type === state.type)
      .sort((a, b) => (state.period === "upcoming" ? a.when - b.when : b.when - a.when));

    $("[data-class-count]").textContent = `${list.length} ${state.period} ${list.length === 1 ? "class" : "classes"}`;
    $("[data-class-list]").innerHTML = list.length
      ? list.map((c, i) => `
        <li class="p-4 sm:px-5">
          <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[9rem_minmax(0,1fr)_auto_auto]">
            <p class="type-small font-semibold tabular-nums sm:text-base">${fmtDay(c.when)}<span class="block font-normal text-muted">${fmtTime(c.when)} · ${c.length}</span></p>
            <p class="col-span-2 row-start-2 font-semibold sm:col-span-1 sm:row-start-auto">${c.title}</p>
            <span class="badge badge-proposed row-start-1 sm:row-start-auto">${c.type}</span>
            <button type="button" class="link-arrow col-span-2 min-h-11 justify-self-start type-small sm:col-span-1 sm:justify-self-end" aria-expanded="false" aria-controls="cl-det-${i}" data-details>Details</button>
          </div>
          <p id="cl-det-${i}" class="mt-3 border-s-2 border-teal ps-3 type-small text-muted" hidden>${c.note}</p>
        </li>`).join("")
      : `<li class="p-8 text-center text-muted">No ${state.period} classes of this type.</li>`;
  }

  $$('[data-period]').forEach((tab, i, all) => {
    const select = (t) => {
      all.forEach((x) => { x.setAttribute("aria-selected", String(x === t)); x.tabIndex = x === t ? 0 : -1; });
      state.period = t.dataset.period;
      renderSchedule();
    };
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const n = all[(i + 1) % all.length]; select(n); n.focus(); }
    });
  });
  $("[data-type-filters]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]");
    if (!b) return;
    $$("[data-type]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    state.type = b.dataset.type;
    renderSchedule();
  });
  $("[data-class-list]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-details]");
    if (!b) return;
    const panel = document.getElementById(b.getAttribute("aria-controls"));
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open));
    b.firstChild.textContent = open ? "Hide details" : "Details";
    panel.hidden = !open;
  });

  /* --------------------------------------------------------------- Progress */
  function renderProgress() {
    $("[data-stages]").innerHTML = STAGES.map((s, si) => {
      const p = pct(s);
      return `
      <section class="rounded border border-line bg-paper p-5 sm:p-6" aria-labelledby="st-${s.key}">
        <div class="flex items-baseline justify-between gap-3">
          <h2 id="st-${s.key}" class="type-h3">${s.name}</h2>
          <span class="font-extrabold tabular-nums" data-pct="${si}">${p}%</span>
        </div>
        <div class="mt-3 h-2 overflow-hidden rounded-full bg-sand" role="progressbar" aria-label="${s.name} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" data-bar="${si}">
          <div class="h-full rounded-full bg-crimson transition-[width] duration-300" style="width:${p}%"></div>
        </div>
        <ul class="mt-5 space-y-1" role="list">
          ${s.skills.map(([name, done], ki) => `
            <li><label class="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" class="size-5 shrink-0 accent-crimson" data-skill="${si}:${ki}" ${done ? "checked" : ""}>
              <span class="${done ? "" : "text-muted"}">${name}</span>
            </label></li>`).join("")}
        </ul>
      </section>`;
    }).join("");
  }
  $("[data-stages]").addEventListener("change", (e) => {
    const box = e.target.closest("[data-skill]");
    if (!box) return;
    const [si, ki] = box.dataset.skill.split(":").map(Number);
    STAGES[si].skills[ki][1] = box.checked;
    box.nextElementSibling.classList.toggle("text-muted", !box.checked);
    const p = pct(STAGES[si]);
    const bar = $(`[data-bar="${si}"]`);
    bar.setAttribute("aria-valuenow", p);
    bar.firstElementChild.style.width = `${p}%`;
    $(`[data-pct="${si}"]`).textContent = `${p}%`;
    renderOverview();
  });

  /* --------------------------------------------------------------- Activity */
  const KIND = { class: ["Class", "bg-teal"], practice: ["Practice", "bg-line-strong"], milestone: ["Milestone", "bg-crimson"] };
  function renderActivity() {
    const list = ACTIVITY.filter((a) => state.activity === "all" || a.kind === state.activity);
    $("[data-activity-count]").textContent = `${list.length} ${list.length === 1 ? "entry" : "entries"}`;
    $("[data-activity]").innerHTML = list
      .map((a) => `
        <li class="relative pb-6">
          <span class="absolute -start-[1.95rem] top-1.5 size-3 rounded-full ring-4 ring-chalk ${KIND[a.kind][1]}" aria-hidden="true"></span>
          <p class="type-small text-muted"><time datetime="${a.when.toISOString()}">${fmtDay(a.when)}</time> · ${KIND[a.kind][0]}</p>
          <p class="mt-0.5 font-semibold">${a.text}</p>
        </li>`)
      .join("");
  }
  $("#activity-filter").addEventListener("change", (e) => { state.activity = e.target.value; renderActivity(); });

  /* ------------------------------------------------------------ Preferences */
  const prefsForm = $("#prefs-form");
  const prefsStatus = $("#prefs-status");
  $$("[data-switch]").forEach((s) => s.addEventListener("click", () => s.setAttribute("aria-checked", String(s.getAttribute("aria-checked") !== "true"))));

  prefsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl = prefsForm.elements.name;
    const name = nameEl.value.trim();
    const err = $("#pref-name-error");
    if (name.length < 2) {
      err.querySelector("[data-msg]").textContent = "Enter a display name of at least 2 characters.";
      err.hidden = false;
      nameEl.setAttribute("aria-invalid", "true");
      nameEl.focus();
      return;
    }
    err.hidden = true;
    nameEl.setAttribute("aria-invalid", "false");
    $$("[data-display-name]").forEach((el) => (el.textContent = name)); // textContent: user text is never parsed as HTML
    prefsStatus.className = "form-status form-status--info";
    prefsStatus.innerHTML = `<strong>Updated on this page only.</strong> Preferences are not saved to an account and will reset when you reload.`;
    prefsStatus.setAttribute("role", "status");
    prefsStatus.hidden = false;
    prefsStatus.focus();
  });
  prefsForm.addEventListener("reset", () => {
    setTimeout(() => {
      $$("[data-display-name]").forEach((el) => (el.textContent = "Student"));
      $('[data-switch="class"]').setAttribute("aria-checked", "true");
      $('[data-switch="practice"]').setAttribute("aria-checked", "false");
      $('[data-switch="show"]').setAttribute("aria-checked", "true");
      $("#pref-name-error").hidden = true;
      prefsForm.elements.name.setAttribute("aria-invalid", "false");
      prefsStatus.hidden = true;
    });
  });

  /* ------------------------------------------- Site theme / direction controls */
  if (window.StudioPrefs) {
    const sync = ({ theme, dir }) => {
      $$("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(theme === "dark")));
      $("[data-pref-theme]").setAttribute("aria-checked", String(theme === "dark"));
      $("[data-pref-dir]").setAttribute("aria-checked", String(dir === "rtl"));
      $$("[data-theme-set]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeSet === theme)));
      $$("[data-dir-set]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.dirSet === dir)));
    };
    $$("[data-theme-set]").forEach((b) => b.addEventListener("click", () => { if (window.StudioPrefs.state().theme !== b.dataset.themeSet) window.StudioPrefs.toggleTheme(); }));
    $$("[data-dir-set]").forEach((b) => b.addEventListener("click", () => { if (window.StudioPrefs.state().dir !== b.dataset.dirSet) window.StudioPrefs.toggleDir(); }));
    $$("[data-theme-toggle], [data-pref-theme]").forEach((b) => b.addEventListener("click", () => window.StudioPrefs.toggleTheme()));
    $$("[data-dir-toggle], [data-pref-dir]").forEach((b) => b.addEventListener("click", () => window.StudioPrefs.toggleDir()));
    window.StudioPrefs.onChange(sync);
    sync(window.StudioPrefs.state());
  }

  /* ------------------------------------------------- Mobile navigation panel */
  const menuBtn = $("[data-app-menu-toggle]");
  const menu = $("#app-menu");
  const setMenu = (open, { focus = true } = {}) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".sr-only").textContent = open ? "Close menu" : "Menu";
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open && focus) menu.querySelector("a, button").focus();
  };
  menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a[href^='#']")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 64rem)").addEventListener("change", (e) => { if (e.matches && !menu.hidden) setMenu(false); });

  /* -------------------------------------------------------------------- Init */
  renderOverview();
  renderSchedule();
  renderProgress();
  renderActivity();
  show(location.hash.slice(1), false);
})();
