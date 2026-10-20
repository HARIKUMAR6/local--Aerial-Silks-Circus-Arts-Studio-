/* ==========================================================================
   Student portal — FRONTEND DEMO ONLY
   - No backend, API, database or authentication service is called.
   - Passwords are never stored, compared against anything or transmitted.
     After a submit, password fields are cleared from the page.
   - A valid submit only shows an honest "nothing happened" message.
   ========================================================================== */
(function () {
  "use strict";

  const REGISTER_MESSAGE =
    "<strong>Registration isn't available yet.</strong> No account was created and your details were not saved.";
  const SIGNIN_MESSAGE =
    "<strong>Sign-in isn't available yet.</strong> You have not been signed in and your details were not saved.";

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  /* ------------------------------------------------- Tabs (Sign in / Register) */
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const selectTab = (tab, focus = true) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
    history.replaceState(null, "", tab.id === "tab-register" ? "#register" : "#signin");
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const rtl = document.documentElement.dir === "rtl";
      const next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
      if (next) { e.preventDefault(); selectTab(tabs[(i + next + tabs.length) % tabs.length]); }
      if (e.key === "Home") { e.preventDefault(); selectTab(tabs[0]); }
      if (e.key === "End") { e.preventDefault(); selectTab(tabs[tabs.length - 1]); }
    });
  });
  document.querySelectorAll("[data-switch-to]").forEach((b) =>
    b.addEventListener("click", () => selectTab(document.getElementById(`tab-${b.dataset.switchTo}`)))
  );
  if (location.hash === "#register") selectTab(document.getElementById("tab-register"), false);

  /* ------------------------------------------------------- Show / hide password */
  document.querySelectorAll("[data-pw-toggle]").forEach((btn) => {
    const input = document.getElementById(btn.dataset.pwToggle);
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", String(show));
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* ---------------------------------------------------------------- Validation */
  function setup(form, rules, successHtml) {
    const status = form.querySelector("[data-status]");
    const setError = (el, msg) => {
      const err = document.getElementById(`${el.id}-error`);
      err.querySelector("[data-msg]").textContent = msg;
      err.hidden = !msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    const check = (name) => {
      const el = form.elements[name];
      const msg = rules[name](el, form);
      setError(el, msg);
      return msg;
    };
    Object.keys(rules).forEach((name) => {
      const el = form.elements[name];
      const ev = el.type === "checkbox" ? "change" : "input";
      el.addEventListener(ev, () => {
        if (el.getAttribute("aria-invalid") === "true") check(name);
        // Re-check the confirmation when the password changes
        if (name === "password" && form.elements.confirm && form.elements.confirm.value) check("confirm");
      });
      if (el.type !== "checkbox") el.addEventListener("blur", () => { if (el.value) check(name); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = Object.keys(rules).map((n) => [n, check(n)]).filter(([, m]) => m);
      if (errors.length) {
        status.className = "form-status form-status--error";
        status.innerHTML =
          `<strong>Please fix ${errors.length === 1 ? "1 field" : errors.length + " fields"}:</strong>` +
          `<ul class="mt-2 list-disc ps-5">${errors
            .map(([n, m]) => `<li><a class="underline underline-offset-2" href="#${form.elements[n].id}">${m}</a></li>`)
            .join("")}</ul>`;
        status.setAttribute("role", "alert");
      } else {
        status.className = "form-status form-status--info";
        status.innerHTML = successHtml;
        status.setAttribute("role", "status");
        // Nothing is kept: clear password fields and reset their visibility
        form.querySelectorAll('input[name="password"], input[name="confirm"]').forEach((p) => {
          p.value = "";
          p.type = "password";
        });
        form.querySelectorAll("[data-pw-toggle]").forEach((b) => {
          b.textContent = "Show";
          b.setAttribute("aria-pressed", "false");
          b.setAttribute("aria-label", "Show password");
        });
      }
      status.hidden = false;
      status.focus();
    });

    status.addEventListener("click", (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      e.preventDefault();
      document.querySelector(a.getAttribute("href")).focus();
    });
  }

  setup(
    document.getElementById("form-signin"),
    {
      email: (el) => (!el.value.trim() ? "Enter your email address." : emailOk(el.value) ? "" : "Enter an email address in the format name@example.com."),
      password: (el) => (el.value ? "" : "Enter your password."),
    },
    SIGNIN_MESSAGE
  );

  setup(
    document.getElementById("form-register"),
    {
      name: (el) => (el.value.trim().length >= 2 ? "" : "Enter your full name."),
      email: (el) => (!el.value.trim() ? "Enter your email address." : emailOk(el.value) ? "" : "Enter an email address in the format name@example.com."),
      password: (el) =>
        !el.value ? "Create a password." : el.value.length < 8 || !/[A-Za-z]/.test(el.value) || !/\d/.test(el.value)
          ? "Use at least 8 characters, including a letter and a number." : "",
      confirm: (el, form) => (!el.value ? "Confirm your password." : el.value === form.elements.password.value ? "" : "The passwords don't match."),
      terms: (el) => (el.checked ? "" : "Agree to the terms to continue."),
    },
    REGISTER_MESSAGE
  );

  /* ------------------------------------------------- Theme / direction buttons */
  if (window.StudioPrefs) {
    const sync = ({ theme }) =>
      document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(theme === "dark")));
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => window.StudioPrefs.toggleTheme()));
    document.querySelectorAll("[data-dir-toggle]").forEach((b) => b.addEventListener("click", () => window.StudioPrefs.toggleDir()));
    window.StudioPrefs.onChange(sync);
    sync(window.StudioPrefs.state());
  }
})();
