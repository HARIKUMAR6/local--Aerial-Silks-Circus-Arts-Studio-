/* ==========================================================================
   Instructor profiles — ILLUSTRATIVE SAMPLE CONTENT
   The studio has not yet supplied its instructors, so the four profiles below
   are sample profiles written to show the layout. Names, backgrounds and
   experience are invented, and the photographs are stock images of performers
   who are not these people. The page says so (see ILLUSTRATIVE).

   To replace them with real instructors:
     1. Edit or replace the objects in INSTRUCTORS (one per person).
     2. Set ILLUSTRATIVE to false — the "Illustrative" badges and the sample
        notice disappear.
     3. Add each instructor's own photo to assets/images/instructors/ as
        <name>-800.jpg and <name>-1600.jpg (4:5 portrait works best).

   Fields (all required except `focus`):
     name            Full name
     role            Professional role / designation
     expertise       Area of expertise
     experience      Years of experience, with a short qualifier
     specialization  Apparatus, level or style taught
     bio             Short professional biography (2–3 sentences)
     photo           Image path without size suffix, e.g. "assets/images/instructors/ana"
     photoAlt        Describes the photo for screen readers
     focus           Optional CSS object-position for the crop, e.g. "50% 30%"
   ========================================================================== */
(function () {
  "use strict";

  const ILLUSTRATIVE = true;

  const INSTRUCTORS = [
    {
      name: "Mara Ellison",
      role: "Head Instructor, Aerial Silks",
      expertise: "Silks technique and safe progression",
      experience: "12 years teaching aerial silks",
      specialization: "Beginner to intermediate: climbs, wraps and first inversions",
      bio: "Mara leads the foundations programme and designs how new students move from the floor to height. She teaches grip, alignment and fabric handling in small, repeatable steps, so strength builds before height does. Her classes suit first-timers and returning students alike.",
      photo: "assets/images/instructors/profile-white-fabric",
      photoAlt: "Illustrative portrait: a woman in a black top looks at the camera with both arms raised, wrapped in white aerial fabric.",
      focus: "50% 35%",
    },
    {
      name: "Julian Reyes",
      role: "Performance and Drops Coach",
      expertise: "Dynamic drops, choreography and stage presence",
      experience: "9 years performing and coaching",
      specialization: "Advanced silks sequences, drops and showcase preparation",
      bio: "Julian works with students who are ready to link skills into a full routine. He breaks drops and transitions into controlled stages, then helps each performer shape phrasing and timing to suit their own style. He also coaches students preparing for studio showcases.",
      photo: "assets/images/instructors/profile-violet-silks",
      photoAlt: "Illustrative portrait: a male aerialist suspended in silks against violet stage lighting, one arm stretched up the fabric.",
      focus: "55% 40%",
    },
    {
      name: "Elena Voss",
      role: "Advanced Silks and Flexibility Coach",
      expertise: "Inversions, line and flexibility in the air",
      experience: "10 years in aerial and circus training",
      specialization: "Advanced inversions, split positions and controlled flexibility work",
      bio: "Elena coaches advanced students on clean lines and safe, deep positions in the fabric. Her sessions pair mobility preparation with careful inversion technique, with attention to recovery as much as range. She is known for patient, detailed feedback.",
      photo: "assets/images/instructors/profile-crimson-inversion",
      photoAlt: "Illustrative portrait: an aerialist in a white leotard folds into a deep inverted position in two red silks against a dark background.",
      focus: "50% 50%",
    },
    {
      name: "Anika Rao",
      role: "Conditioning and Mobility Coach",
      expertise: "Strength and mobility for aerial work",
      experience: "7 years coaching strength and movement",
      specialization: "Grip and core conditioning, mobility and fabric foundations",
      bio: "Anika builds the strength and range that aerial skills depend on. Her conditioning classes complement silks training with grip, core and shoulder work, and she introduces gentle fabric-based flexibility for newcomers. She works at each student's pace.",
      photo: "assets/images/instructors/profile-window-hammock",
      photoAlt: "Illustrative portrait: a woman hangs upside down in soft aerial fabric in front of a bright window with trees outside.",
      focus: "50% 45%",
    },
  ];

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
    // Each card spans 7 rows of the list grid (photo, name, role, 3 fields, bio) via subgrid,
    // so every row lines up across cards in the same grid row whatever the text length.
    const card = el("article", "row-span-7 grid grid-rows-subgrid gap-y-0 bg-paper");

    const frame = el("div", "media relative aspect-[4/5]");
    const img = el("img");
    img.src = `${p.photo}-800.jpg`;
    img.srcset = `${p.photo}-800.jpg 800w, ${p.photo}-1600.jpg 1600w`;
    img.sizes = "(min-width: 1280px) 22vw, (min-width: 640px) 44vw, 92vw";
    img.width = 800;
    img.height = 1000;
    img.alt = p.photoAlt;
    img.loading = "lazy";
    img.decoding = "async";
    if (p.focus) img.style.objectPosition = p.focus;
    frame.appendChild(img);
    if (ILLUSTRATIVE) {
      frame.appendChild(el("span", "absolute start-3 top-3 bg-stage px-2.5 py-1 eyebrow text-on-stage", "Illustrative"));
    }
    card.appendChild(frame);

    const pad = "px-5 sm:px-6";
    card.appendChild(el("h3", `type-h4 ${pad} pt-5 sm:pt-6`, p.name));
    card.appendChild(el("p", `eyebrow ${pad} mt-1 pb-5 text-crimson`, p.role));

    [["Expertise", p.expertise], ["Experience", p.experience], ["Specialization", p.specialization]].forEach(([k, v], i, all) => {
      const row = el("dl", `mx-5 sm:mx-6 border-t border-line py-3 ${i === all.length - 1 ? "border-b" : ""}`);
      row.appendChild(el("dt", "eyebrow text-muted", k));
      row.appendChild(el("dd", "type-small mt-1", v));
      card.appendChild(row);
    });
    card.appendChild(el("p", `${pad} pt-5 pb-5 text-muted sm:pb-6`, p.bio));
    list.appendChild(card);
  });

  const notice = host.querySelector("[data-sample-notice]");
  if (notice) notice.hidden = !ILLUSTRATIVE;
  host.hidden = false;
  const pending = document.getElementById("profiles-pending");
  if (pending) pending.hidden = true;
})();
