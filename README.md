# Aerial Silks & Circus Arts Studio (temporary name)

Static, frontend-only website: **HTML5 + Tailwind CSS + vanilla JavaScript**.
No framework, no backend, no runtime libraries.

> The name "Aerial Silks & Circus Arts Studio" and the twin-silk logo mark are **temporary**.
> Replace `BRAND` and `logoMark()` in `assets/js/site-chrome.js` (and the favicon in each page head) when the studio's identity is supplied.

## Running

Open `index.html` in a browser, or serve the folder with any static file server.
The compiled stylesheet (`assets/css/styles.css`) is committed, so no build is needed to view the site.

## Building CSS

Node is used **only** to compile Tailwind. It adds nothing to the website at runtime.

```sh
npm install      # one time: installs the Tailwind CLI (dev-only)
npm run build    # src/input.css → assets/css/styles.css (minified)
npm run watch    # rebuild on change while editing
```

> The scripts call the CLI's entry file directly because the `&` in this folder's name
> breaks npm's Windows command shims.

## Structure

```
index.html                Home 1 — "the performance" (dark, theatrical)
contact.html              Contact — five sections: Hero, Get in touch, Send an enquiry (demo form), Find the studio (Leaflet map), Before you reach out
instructors.html          Instructors — five sections: Hero, Teaching philosophy, Guidance, The practice, Start a conversation
classes.html              Classes — five sections: Hero, Ways to train, Learning journey, The practice, Start a conversation
about.html                About — "the programme booklet": exactly five sections (Cover, Why we climb, Tension & Release, The practice, Curtain call)
home-2.html               Home 2 — "the rehearsal room" (daylight studio); same business content, different art direction
src/input.css             Design tokens (@theme), light/dark theme tokens, shared components — edit styles here
assets/css/styles.css     Compiled output — do not edit by hand
assets/js/preferences.js  Theme (light/dark) + direction (ltr/rtl): saved choice, system fallback, applied before first paint
assets/js/site-chrome.js  Shared <site-header> and <site-footer> for every public page
assets/js/contact.js      Contact form validation (demo — nothing is sent) and Leaflet map; set STUDIO_LOCATION once the address is confirmed
assets/js/home.js         Home page interactions (Home 1 discipline image reveal; scroll reveals on both homepages)
assets/images/home-1/     Home 1 photography — all images stored locally at 800w and 1600w (see Image credits)
assets/images/contact/    Contact photography, stored locally at 800w and 1600w
assets/images/instructors/ Instructors photography, stored locally at 800w and 1600w
assets/images/classes/    Classes photography, stored locally at 800w and 1600w (see Image credits)
assets/images/about/      About photography, stored locally at 800w and 1600w (see Image credits)
assets/images/home-2/     Home 2 photography, stored locally at 800w and 1600w (see Image credits)
```

### Adding the shared header and footer to a page

```html
<html lang="en" dir="ltr" data-theme="light">
<head>
  …
  <script src="assets/js/preferences.js"></script>          <!-- blocking, in <head>: avoids a theme/direction flash -->
  <script src="assets/js/site-chrome.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <site-header current="about"></site-header>     <!-- add `overlay` only on pages with a dark hero -->
  <main id="main" tabindex="-1">…</main>
  <site-footer></site-footer>
```

Nav items and links live in one place: `NAV_ITEMS` / `HOME_MENU` / `LINKS` at the top of `site-chrome.js`.
`current` accepts `home`, `about`, `classes`, `instructors`, `contact`, `dashboard`.

### Theme and direction conventions

- **Theme:** `html[data-theme="light" | "dark"]`. Use the semantic tokens (`bg-chalk`, `bg-sand`, `text-fg`, `text-muted`, `border-line`, `text-crimson` …); they flip automatically.
  `text-ink` / `bg-ink` are the *fixed* near-black for text on bright fills. "Stage" surfaces (`.on-stage`, `bg-stage`) are dark in both themes.
- **Direction:** `html[dir="ltr" | "rtl"]`. Use logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `border-s`, `text-start`) — never `left` / `right` / `ml` / `mr` for layout.
  Directional arrows get class `flip-x` (or sit inside `.btn` / `.link-arrow`, which flip automatically). Use `rtl:` for the rare direction-specific override.
- Saved in `localStorage` as `studio-theme` and `studio-dir`. With nothing saved: theme follows the system setting; direction is LTR.

## Build status

| Page | Status |
|---|---|
| Home 1 (`index.html`) | Built — reviewed |
| Home 2 (`home-2.html`) | Built — awaiting review |
| About (`about.html`) | Built — awaiting review |
| Classes (`classes.html`) | Built — awaiting review |
| Instructors (`instructors.html`) | Built — awaiting review |
| Contact (`contact.html`) | Built — awaiting review. Form is a labelled demonstration (no backend); map shows no studio pin |
| Portal (`portal/index.html`), Dashboard (`portal/dashboard.html`) | Not built — header "Student login" and "Dashboard" links are ready for them |

Links to unbuilt pages currently lead to a missing file; that is expected until each page is built.

## Placeholder register

**Home 1, Home 2 and About are public-facing:** they show no editorial placeholders (the shared footer still carries contact/legal TBC markers). Their open items are tracked in
[Home 1 — awaiting studio confirmation](#home-1--awaiting-studio-confirmation) and
[Home 2 — awaiting studio confirmation](#home-2--awaiting-studio-confirmation) and
[About — awaiting studio confirmation](#about--awaiting-studio-confirmation) instead.

| Item | Where |
|---|---|
| Studio name and logo (temporary name + twin-silk mark in use) | Header, footer, page title, hero eyebrow |
| Address, opening hours, phone, email, social channels | Footer |
| Privacy policy, terms | Footer |

### Home 1 — awaiting studio confirmation

These were removed from the public Home 1 page (no fake data, no editorial markers). Confirm or supply them, then add them back:

| Item | Home 1 location | What the page shows now |
|---|---|---|
| Whether Aerial Hoop and Trapeze are offered | Disciplines | Customer-facing badge "Availability to be confirmed" |
| Any further circus disciplines | Disciplines | Row removed (was "More disciplines — TBC") |
| Level descriptions and prerequisites | Training path | The three level descriptions are proposed copy — confirm wording; prerequisites not shown |
| Safety approach: rigging inspections, crash mats, spotting, class sizes, instructor credentials | Training — "Safety on the rig" | Invitation to ask before booking, linking to Contact; no claims |
| Upcoming showcase: name, date, venue, eligibility | Performance (`performance-duo-red-silks`) | "On the night: Costume · Lights · Audience" + "Ask us about upcoming opportunities to perform" |
| A real student or instructor quote (with permission) | Community | Brand line "Strength is easier to find in good company." — proposed copy, not a testimonial |
| Trial class and pricing | Final call to action | Not shown |
| Differentiator copy ("Technique before height", etc.) | Studio section | Shown without a marker — proposed copy, confirm wording |
| Studio photography | Whole page | Licensed stock (credited below); captions calling images "placeholder" were removed |
| Studio address / map location | Contact: map | Neutral world view, no marker. Set `STUDIO_LOCATION` in `assets/js/contact.js` to add a pin |
| Phone, email, opening hours, social links | Contact: Get in touch | Not shown; page says details will be listed once published |
| Enquiry submission service | Contact: form | Form validates but does not send; it says so on submit and keeps the visitor's text |
| Instructor names, portraits, biographies, qualifications | Instructors page | No profiles shown; "Meet the instructors" explains the role of guidance and says profiles will be shared soon |
| Class names, formats offered, schedules, prices, durations, levels | Classes page | Not stated anywhere; "Ways to train" describes general formats and says "Ask us which are currently running" |
| Booking | Closing CTA, hero CTA | Buttons read "Find your first class" and link to the planned `classes.html#beginner`; no booking is implied until Classes / portal exist |

### Home 2 — awaiting studio confirmation

Removed from the public Home 2 page on the correction pass. Confirm or supply, then restore:

| Item | Home 2 location | What the page shows now |
|---|---|---|
| Whether Aerial Hoop and Trapeze are offered; any further disciplines | Apparatus | Badge "Availability to be confirmed" + "Ask us about hoop and trapeze"; "More disciplines" tile removed |
| Level descriptions and prerequisites | Training path | Level descriptions are proposed copy; prerequisites not shown |
| Photo of an instructor coaching a student on aerial silks | Coached on every climb | Section is now text-led (no photo frame) |
| Safety approach: rigging, mats, spotting, class sizes | Coached on every climb | "Before your first climb, ask us about…" topic list linking to Contact — no claims |
| Instructor profiles | Coached on every climb / booking rows | Links to the planned Instructors page |
| Upcoming showcase: name, date, venue, eligibility | Showcase poster | Programme card with "Ask us about upcoming opportunities to perform"; portal "register" link removed |
| A real student or instructor quote (with permission) | Community | Short general description — not a testimonial |
| Trial class, pricing, timetable | Booking rows | Not shown; third row reads "Find your first class" (no booking implied) |
| Values copy ("Technique before height", Strength / Expression lists) | What we stand for | Shown without a marker — proposed copy, confirm wording |
| Studio photography | Whole page | Licensed stock (credited below); placeholder caption removed |

### About — awaiting studio confirmation

Removed from the public About page on the correction pass (nothing invented in their place):

| Item | About location | What the page shows now |
|---|---|---|
| Studio story, founding date, founders, location | II · Why we climb | General aerial-arts copy + a three-term glossary (climb, wrap, drop) |
| Manifesto wording ("Strength you can trust…") | III · Tension & release | Shown without a marker — proposed copy, confirm wording |
| Studio practice policies | IV · The practice | Four general principles of aerial practice — not studio policies |
| Rig height, inspections, mats, instructor ratio, qualifications, insurance, first aid, waiver | IV · The practice | Removed; "Questions about safety? Ask us" links to Contact |
| Photo of the studio's rig, mats and training space | IV · The practice | Licensed stock photo of silks (credited below) |
| Founder(s), head coach and instructor credits | V · Curtain call | Removed; credits list replaced by a closing line |

## Image credits (placeholder photography)

The shared footer (`site-chrome.js`) carries a short site-wide attribution naming the image sources in use
(currently Unsplash and Pexels). Per-photo credits and licences are listed below. If a page adds a new source,
update that footer line too.

**Rule: no image appears on more than one page** — Home 1, Home 2 and every inner page each have their own set (checked by path, photo ID and pixel fingerprint).

### Home 1 (`index.html`)

All Home 1 images are stored locally in `assets/images/home-1/` (`<name>-800.jpg` and `<name>-1600.jpg`). Unsplash images are
used under the [Unsplash License](https://unsplash.com/license) (free use, downloading permitted; attribution appreciated, not required).
Each is to be replaced with studio photography.

| Used in | Photo | Photographer |
|---|---|---|
| Hero (`hero-white-silk`) | [Aerial silks performance on dark stage](https://unsplash.com/photos/n4KiW-TFerI) | Ahmad Odeh |
| Studio section (`studio-blue-silks`) | [Pexels 23638607 — aerial silk performance](https://www.pexels.com/photo/aerial-silk-performance-23638607/) (Pexels License) | kobby-katalist |
| Disciplines — Silks (`discipline-silks`) | [Performer on red aerial silks](https://unsplash.com/photos/oF82bSqzuUY) | Igor Savelev |
| Training (main) (`training-rope-coaching`) | [Aerial routine with instructors watching](https://unsplash.com/photos/WLWnKV5egzg) | Centre for Ageing Better |
| Training (inset) (`training-coach-talk`) | [Two women in a gymnasium with trapeze equipment](https://unsplash.com/photos/D_IUynjnR5Y) | Centre for Ageing Better |
| Performance | [Two acrobats performing aerial silks routine](https://unsplash.com/photos/r9wTQj27p8o) | Gerardo Martin Fernandez Vallejo |
| Community (wide) (`community-stage-lights`) | [Two acrobats perform on a stage with abstract lights](https://unsplash.com/photos/J6ctfElqfqk) | Gerardo Martin Fernandez Vallejo |
| Community (tall) (`community-red-silks-audience`) | [Acrobats perform on red aerial silks](https://unsplash.com/photos/IzsR6qr8Rb0) | Gerardo Martin Fernandez Vallejo |
| Community (small) (`community-rings`) | [Woman performing aerial acrobatics on trapeze rings](https://unsplash.com/photos/I_UWkXYFenY) | Centre for Ageing Better |

**Home 1 local images** — `assets/images/home-1/`, from Pexels under the [Pexels License](https://www.pexels.com/license/), at `-800.jpg` and `-1600.jpg`.
They replaced two Unsplash images whose subjects were too small to read (a distant hoop; an outdoor flying-trapeze rig).

| File (`assets/images/home-1/`) | Used in | Source (Pexels) | Photographer (Pexels username) |
|---|---|---|---|
| `discipline-hoop` | Disciplines — Aerial Hoop | [35333247](https://www.pexels.com/photo/aerial-acrobat-performing-on-suspended-hoop-35333247/) | jesus-marchante |
| `discipline-trapeze` | Disciplines — Trapeze | [35017410](https://www.pexels.com/photo/dramatic-aerial-acrobat-performing-trapeze-act-35017410/) | lau-arraigada |

### Home 2 (`home-2.html`)

Downloaded from Pexels into `assets/images/home-2/` under the [Pexels License](https://www.pexels.com/license/)
(free to use, modify and host; attribution not required but given here). Each file exists at `-800.jpg` and `-1600.jpg`.
To replace one with studio photography, overwrite both sizes with the same file name (or update the `src`/`srcset` and `alt` in `home-2.html`).

| File (`assets/images/home-2/`) | Used in | Source (Pexels) | Photographer (Pexels username) |
|---|---|---|---|
| `hero-inverted-white-silk` | Hero strip | [12932738](https://www.pexels.com/photo/woman-in-beige-clothing-performing-tricks-on-aerial-silks-12932738/) | yani-bautista |
| `hero-grip-detail` | Hero strip | [4999397](https://www.pexels.com/photo/close-up-shot-of-a-person-holding-an-aerial-silk-4999397/) | Ketut Subiyanto |
| `hero-studio-monochrome` | Hero strip | [29715456](https://www.pexels.com/photo/aerial-silk-performer-in-studio-setting-29715456/) | lubomir-satko |
| `apparatus-silks-studio` | Apparatus — Aerial Silks | [29715462](https://www.pexels.com/photo/female-aerialist-performing-on-silk-in-indoor-studio-29715462/) | lubomir-satko |
| `apparatus-hoop` | Apparatus — Hoop (proposed) | [15362819](https://www.pexels.com/photo/dancer-with-legs-raised-on-loop-15362819/) | hoang-nguy-n |
| `apparatus-trapeze` | Apparatus — Trapeze (proposed) | [37071005](https://www.pexels.com/photo/daring-aerial-acrobat-in-a-trapeze-performance-37071005/) | olivia |
| `path-beginner-floor` | Training path — Beginner | [29715424](https://www.pexels.com/photo/aerial-silk-acrobat-performing-indoor-routine-29715424/) | lubomir-satko |
| `path-intermediate-split` | Training path — Intermediate | [29715457](https://www.pexels.com/photo/aerial-silk-performer-in-elegant-pose-indoors-29715457/) | lubomir-satko |
| `path-advanced-height` | Training path — Advanced | [30131194](https://www.pexels.com/photo/professional-aerial-silk-performer-in-brazil-30131194/) | andersonportella |
| `showcase-stage-blue` | Showcase poster background | [19880215](https://www.pexels.com/photo/woman-doing-acrobatics-with-aerial-silks-19880215/) | faugustons |
| `showcase-duo` | Showcase programme card | [13990509](https://www.pexels.com/photo/dancers-hanging-on-clothes-13990509/) | that-photoguy-matt |
| `community-smile-red-silk` | Community | [29715463](https://www.pexels.com/photo/woman-posing-on-aerial-silk-in-studio-setting-29715463/) | lubomir-satko |
| `community-studio-climb` | Community | [12386683](https://www.pexels.com/photo/woman-during-gymnastics-workout-12386683/) | joicerivas |

**Not sourced:** a licensed daylight photo of an *instructor coaching a student on aerial silks*. Every free candidate found
showed aerial-yoga hammocks, so Home 2's coaching section is text-led until studio photography is supplied.

### About (`about.html`)

Downloaded from Pexels into `assets/images/about/` under the [Pexels License](https://www.pexels.com/license/).
Each file exists at `-800.jpg` and `-1600.jpg`. Verified unique against Home 1 and Home 2 (path, photo ID and pixel fingerprint).

| File (`assets/images/about/`) | Used in | Source (Pexels) | Photographer (Pexels username) |
|---|---|---|---|
| `cover-monochrome-curtain` | I · Programme cover | [27239071](https://www.pexels.com/photo/a-black-and-white-photo-of-a-woman-doing-aerial-27239071/) | andersonportella |
| `story-red-silk-split` | II · The studio story | [32616630](https://www.pexels.com/photo/aerial-acrobat-performing-on-silk-ribbons-32616630/) | mykhailo-petrenko |
| `tension-symmetrical-hold` | III · Tension (left page) | [30131184](https://www.pexels.com/photo/aerial-silk-performer-in-dramatic-pose-on-stage-30131184/) | andersonportella |
| `release-purple-flow` | III · Release (right page) | [29576321](https://www.pexels.com/photo/circus-performer-on-aerial-silks-performing-stunt-29576321/) | alex-kihang-a |
| `practice-inverted-monochrome` | IV · The practice | [29860458](https://www.pexels.com/photo/graceful-aerial-silk-performance-in-black-and-white-29860458/) | andersonportella |

**Not sourced:** a licensed photo of a real circus studio's rig, mats or training space (searches returned ship rigging
and industrial hardware). About section IV uses a silks performance photo until studio photography is supplied.

### Classes (`classes.html`)

Downloaded from Pexels into `assets/images/classes/` under the [Pexels License](https://www.pexels.com/license/), at `-800.jpg` and `-1600.jpg`.
Verified unique against Home 1, Home 2 and About (path and photo ID; no shared photographer shoots).

| File (`assets/images/classes/`) | Used in | Source (Pexels) | Photographer (Pexels username) |
|---|---|---|---|
| `hero-red-silks-sky` | 1 · Hero | [17709973](https://www.pexels.com/photo/woman-hanging-head-down-17709973/) | andreamostiphotography |
| `formats-monochrome-stage` | 2 · Ways to train | [18823875](https://www.pexels.com/photo/black-and-white-photo-of-an-aerial-dancer-during-a-performance-18823875/) | serday-deviren |
| `practice-purple-silks` | 4 · The practice (wide) | [8149895](https://www.pexels.com/photo/photo-of-an-acrobat-on-the-ropes-8149895/) | alissa-bonneville |
| `practice-hoop-teal` | 4 · The practice (inset) | [40322823](https://www.pexels.com/photo/graceful-aerial-performer-on-lyra-hoop-40322823/) | angel-ruijano |

### Instructors (`instructors.html`)

Downloaded from Pexels into `assets/images/instructors/` under the [Pexels License](https://www.pexels.com/license/), at `-800.jpg` and `-1600.jpg`.
Verified unique against Home 1, Home 2, About and Classes.

| File (`assets/images/instructors/`) | Used in | Source (Pexels) | Photographer (Pexels username) |
|---|---|---|---|
| `hero-monochrome-hoop` | 1 · Hero (arch frame) | [10899160](https://www.pexels.com/photo/person-swinging-on-rope-10899160/) | sergey-platonov |
| `guidance-watching-hoop` | 3 · Meet the instructors | [10039534](https://www.pexels.com/photo/woman-looking-at-gymnast-on-ring-10039534/) | cristian-rojas |
| `practice-pink-hoop` | 4 · The practice (frame 01) | [37129661](https://www.pexels.com/photo/dynamic-aerial-hoop-performer-with-vibrant-lighting-37129661/) | psiconauta |
| `practice-spotlight-hoop` | 4 · The practice (frame 03) | [35228140](https://www.pexels.com/photo/elegant-aerial-performer-in-spotlight-with-hoop-35228140/) | leticiacurveloph |

### Contact (`contact.html`)

Photos downloaded from Pexels into `assets/images/contact/` under the [Pexels License](https://www.pexels.com/license/), at `-800.jpg` and `-1600.jpg`.
Verified unique against Home 1, Home 2, About, Classes and Instructors.

| File (`assets/images/contact/`) | Used in | Source (Pexels) | Photographer (Pexels username) |
|---|---|---|---|
| `hero-hoop-sunset` | 1 · Hero (circle) | [20031006](https://www.pexels.com/photo/aerial-dance-on-a-beach-20031006/) | moralestorres98 |
| `close-silks-cliff` | 5 · Before you reach out (background) | [17507565](https://www.pexels.com/photo/view-of-woman-aerial-dancing-on-the-background-of-a-cliff-17507565/) | ktccphotography |

**Map:** [Leaflet](https://leafletjs.com/) 1.9.4 from cdnjs (pinned with Subresource Integrity) with
[OpenStreetMap](https://www.openstreetmap.org/copyright) standard tiles — no API key. Attribution is shown on the map.
OSM's tile usage policy requires a valid Referer, which a deployed site sends; opening the file directly from disk may not.
For high traffic, switch to a dedicated tile provider.
