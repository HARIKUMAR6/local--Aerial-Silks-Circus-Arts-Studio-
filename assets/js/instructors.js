/* ==========================================================================
   Instructor profiles
   No instructor information is verified in the project yet, so INSTRUCTORS is
   empty and nothing is rendered. Add one object per instructor and the profile
   cards appear on the Instructors page — nothing else needs to change.

   Every field below is required except `photo`; use only facts the studio has
   confirmed (no invented qualifications, experience or achievements):

     {
       name:            "Full name",
       role:            "Professional role / designation",
       expertise:       "Area of expertise",
       experience:      "Relevant experience (years, venues, training — verified only)",
       specialization:  "Specialization (apparatus / style / level taught)",
       bio:             "Short professional biography (2–3 sentences)",
       photo:           "assets/images/instructors/<file>.jpg",   // optional, 4:5 portrait
       photoAlt:        "Describe the photo"                      // required with photo
     }
   ========================================================================== */
(function () {
  "use strict";

  const INSTRUCTORS = [];

  const host = document.getElementById("instructor-profiles");
  const list = host && host.querySelector("[data-profile-list]");
  if (!list || !INSTRUCTORS.length) return;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };

  INSTRUCTORS.forEach((p) => {
    const card = el("article", "flex flex-col bg-paper");
    const frame = el("div", "media aspect-[4/5]");
    if (p.photo) {
      const img = el("img", "object-[50%_30%]");
      img.src = p.photo;
      img.alt = p.photoAlt || "";
      img.loading = "lazy";
      img.decoding = "async";
      frame.appendChild(img);
    } else {
      frame.classList.add("flex", "items-center", "justify-center", "bg-stage", "text-on-stage");
      const initials = p.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
      const mono = el("span", "type-h1", initials);
      mono.setAttribute("aria-hidden", "true");
      frame.appendChild(mono);
    }
    card.appendChild(frame);

    const body = el("div", "flex flex-1 flex-col p-5 sm:p-6");
    body.appendChild(el("h3", "type-h4", p.name));
    body.appendChild(el("p", "eyebrow mt-1 text-crimson", p.role));

    const dl = el("dl", "mt-5 divide-y divide-line border-y border-line");
    [["Expertise", p.expertise], ["Experience", p.experience], ["Specialization", p.specialization]].forEach(([k, v]) => {
      const row = el("div", "grid grid-cols-[minmax(0,1fr)] gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4");
      row.appendChild(el("dt", "eyebrow text-muted", k));
      row.appendChild(el("dd", "type-small", v));
      dl.appendChild(row);
    });
    body.appendChild(dl);
    body.appendChild(el("p", "mt-5 text-muted", p.bio));
    card.appendChild(body);
    list.appendChild(card);
  });

  host.hidden = false;
  const pending = document.getElementById("profiles-pending");
  if (pending) pending.hidden = true;
})();
