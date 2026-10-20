/* ==========================================================================
   Contact page
   - Enquiry form: client-side validation and accessible feedback.
     There is NO backend: on a valid submit the page says so plainly and
     keeps what the visitor typed, so nothing is silently discarded.
   - Topic shortcuts: links with [data-topic] preselect the form's topic.
   - Map: Leaflet + OpenStreetMap tiles (no API key), interactive pan/zoom.
     No studio address is verified, so the map shows a neutral, zoomed-out
     view with NO marker. Set STUDIO_LOCATION once the address is confirmed.
   ========================================================================== */
(function () {
  "use strict";

  /* Confirmed studio location, e.g. { lat: 51.5, lng: -0.12, label: "Studio name, street…" }.
     Leave null until the studio confirms its address — no pin is shown while null. */
  const STUDIO_LOCATION = null;

  /* ------------------------------------------------------------- Form */
  function initForm() {
    const form = document.getElementById("enquiry-form");
    if (!form) return;

    const status = document.getElementById("form-status");
    const fields = {
      name: { el: form.elements.name, check: (v) => (v.trim().length >= 2 ? "" : "Enter your name.") },
      email: {
        el: form.elements.email,
        check: (v) =>
          !v.trim() ? "Enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter an email address in the format name@example.com.",
      },
      topic: { el: form.elements.topic, check: (v) => (v ? "" : "Choose what your enquiry is about.") },
      message: { el: form.elements.message, check: (v) => (v.trim().length >= 10 ? "" : "Write a message of at least 10 characters.") },
    };

    const setError = (key, msg) => {
      const { el } = fields[key];
      const err = document.getElementById(`${el.id}-error`);
      err.querySelector("[data-msg]").textContent = msg;
      err.hidden = !msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    const validate = (key) => {
      const msg = fields[key].check(fields[key].el.value);
      setError(key, msg);
      return msg;
    };

    // Validate on blur, then live once a field has been flagged
    Object.keys(fields).forEach((key) => {
      const { el } = fields[key];
      el.addEventListener("blur", () => { if (el.value) validate(key); });
      el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validate(key); });
      el.addEventListener("change", () => { if (el.getAttribute("aria-invalid") === "true") validate(key); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = Object.keys(fields).map((key) => [key, validate(key)]).filter(([, m]) => m);

      if (errors.length) {
        status.className = "form-status form-status--error";
        status.innerHTML =
          `<strong>Please check ${errors.length === 1 ? "1 field" : errors.length + " fields"}:</strong>` +
          `<ul class="mt-2 list-disc ps-5">${errors
            .map(([key, m]) => `<li><a class="underline underline-offset-2" href="#${fields[key].el.id}">${m}</a></li>`)
            .join("")}</ul>`;
        status.hidden = false;
        status.setAttribute("role", "alert");
        status.focus();
        return;
      }

      // No submission service exists: be explicit and keep the visitor's text
      status.className = "form-status form-status--info";
      status.innerHTML =
        "<strong>Your message has not been sent.</strong> " +
        "This form is a demonstration — the studio's enquiry service is not connected yet. " +
        "Your text is still in the form; please copy it if you'd like to keep it.";
      status.hidden = false;
      status.setAttribute("role", "status");
      status.focus();
    });

    // Error-summary links move focus to the field
    status.addEventListener("click", (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      e.preventDefault();
      document.querySelector(a.getAttribute("href")).focus();
    });

    // Topic shortcuts
    document.querySelectorAll("[data-topic]").forEach((link) =>
      link.addEventListener("click", () => {
        fields.topic.el.value = link.dataset.topic;
        if (fields.topic.el.getAttribute("aria-invalid") === "true") validate("topic");
      })
    );
    const pre = new URLSearchParams(location.search).get("topic");
    if (pre && [...fields.topic.el.options].some((o) => o.value === pre)) fields.topic.el.value = pre;
  }

  /* -------------------------------------------------------------- Map */
  function initMap() {
    const host = document.getElementById("studio-map");
    if (!host) return;
    const fallback = document.getElementById("map-fallback");
    const fail = () => {
      host.hidden = true;
      fallback.hidden = false;
    };
    if (!window.L) return fail();

    try {
      const map = L.map(host, {
        center: STUDIO_LOCATION ? [STUDIO_LOCATION.lat, STUDIO_LOCATION.lng] : [30, 10],
        zoom: STUDIO_LOCATION ? 15 : 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        scrollWheelZoom: false, // avoid hijacking page scroll; buttons, pinch and drag still work
      });

      // Standard OpenStreetMap tiles. In dark theme the tile pane is darkened with a CSS filter (see input.css).
      const layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      let errors = 0;
      layer.on("tileerror", () => { if (++errors > 8) fail(); });

      if (STUDIO_LOCATION) {
        L.marker([STUDIO_LOCATION.lat, STUDIO_LOCATION.lng], { title: STUDIO_LOCATION.label, alt: STUDIO_LOCATION.label })
          .addTo(map)
          .bindPopup(STUDIO_LOCATION.label);
      }

      // Leaflet needs a size recalculation when the container appears late
      new ResizeObserver(() => map.invalidateSize()).observe(host);
      window.studioMap = map;
    } catch (err) {
      fail();
    }
  }

  initForm();
  if (document.readyState === "complete") initMap();
  else window.addEventListener("load", initMap);
})();
