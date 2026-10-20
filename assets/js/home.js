/* ==========================================================================
   Home page interactions
   - Discipline index: hover / keyboard focus swaps the desktop image
   - Scroll reveals for elements marked [data-reveal]
   Content is fully visible without this script.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------- Discipline index reveal */
  function initDisciplineIndex() {
    const list = document.querySelector("[data-discipline-list]");
    const frame = document.querySelector("[data-discipline-frame]");
    if (!list || !frame) return;

    const rows = list.querySelectorAll("[data-discipline]");
    const images = frame.querySelectorAll("[data-discipline-image]");

    const activate = (key) => {
      rows.forEach((row) => row.toggleAttribute("data-active", row.dataset.discipline === key));
      images.forEach((img) => img.toggleAttribute("data-active", img.dataset.disciplineImage === key));
    };

    rows.forEach((row) => {
      const key = row.dataset.discipline;
      row.addEventListener("mouseenter", () => activate(key));
      row.addEventListener("focusin", () => activate(key));
    });
  }

  /* ---------------------------------------------------------- Scroll reveals */
  function initReveals() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  initDisciplineIndex();
  initReveals();
})();
