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
about.html                About — "the programme booklet": exactly five sections (Cover, Story, Tension & Release, Practice & Safety, Credits)
home-2.html               Home 2 — "the rehearsal room" (daylight studio); same business content, different art direction
src/input.css             Design tokens (@theme), light/dark theme tokens, shared components — edit styles here
assets/css/styles.css     Compiled output — do not edit by hand
assets/js/preferences.js  Theme (light/dark) + direction (ltr/rtl): saved choice, system fallback, applied before first paint
assets/js/site-chrome.js  Shared <site-header> and <site-footer> for every public page
assets/js/home.js         Home page interactions (Home 1 discipline image reveal; scroll reveals on both homepages)
assets/images/home-1/     Home 1 local photography (discipline images); other Home 1 images load from Unsplash
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
| Classes, Instructors, Contact | Not built — nav links point to their future filenames |
| Portal (`portal/index.html`), Dashboard (`portal/dashboard.html`) | Not built — header "Student login" and "Dashboard" links are ready for them |

Links to unbuilt pages currently lead to a missing file; that is expected until each page is built.

## Placeholder register

Home 2 and About show the items below as visible dashed **TBC** / **Proposed** markers until the studio supplies them.
**Home 1 is public-facing:** it shows no editorial placeholders. Its open items are tracked in
[Home 1 — awaiting studio confirmation](#home-1--awaiting-studio-confirmation) instead.

| Item | Where |
|---|---|
| Studio name and logo (temporary name + twin-silk mark in use) | Header, footer, page title, hero eyebrow |
| Photo of an instructor coaching a student on aerial silks | Home 2: "Coached on every climb" — shown as a labelled "Photo needed" frame |
| Instructor profiles | Home 2: coaching section |
| Studio story, founding date, founders, location | About: II · The studio story |
| Manifesto wording ("Strength you can trust…") | About: III · Tension & release — proposed copy |
| Studio practice expectations (4 rows) | About: IV · Practice & safety — marked Proposed |
| Rig height, rigging inspections, crash mats, instructor ratio, qualifications, insurance, first aid, waiver & health form | About: IV · Practice & safety — all TBC |
| Photo of the studio's rig, mats and training space | About: IV — shown as a labelled "Photo needed" frame |
| Founder(s) and head coach names | About: V · Credits |
| Timetable | Home 2: booking rows |
| Address, opening hours, phone, email, social channels | Footer |
| Privacy policy, terms | Footer |
| Confirmed disciplines (Hoop and Trapeze are *proposed*; others TBC) | Home 2: apparatus tiles |
| Level descriptions and prerequisites | Home 2: training path |
| Safety approach (rigging, mats, spotting, class sizes) | Home 2: coaching checklist |
| Showcase name, date, venue, eligibility | Home 2: showcase poster |
| Student or instructor quote | Home 2: community |
| Trial class and pricing | Home 2: booking rows |
| Differentiator copy ("Technique before height", etc.) | Home 2: "What we stand for" — proposed copy |

### Home 1 — awaiting studio confirmation

These were removed from the public Home 1 page (no fake data, no editorial markers). Confirm or supply them, then add them back:

| Item | Home 1 location | What the page shows now |
|---|---|---|
| Whether Aerial Hoop and Trapeze are offered | Disciplines | Customer-facing badge "Availability to be confirmed" |
| Any further circus disciplines | Disciplines | Row removed (was "More disciplines — TBC") |
| Level descriptions and prerequisites | Training path | The three level descriptions are proposed copy — confirm wording; prerequisites not shown |
| Safety approach: rigging inspections, crash mats, spotting, class sizes, instructor credentials | Training — "Safety on the rig" | Invitation to ask before booking, linking to Contact; no claims |
| Upcoming showcase: name, date, venue, eligibility | Performance | "On the night: Costume · Lights · Audience" + "Ask us about upcoming opportunities to perform" |
| A real student or instructor quote (with permission) | Community | Brand line "Strength is easier to find in good company." — proposed copy, not a testimonial |
| Trial class and pricing | Final call to action | Not shown |
| Differentiator copy ("Technique before height", etc.) | Studio section | Shown without a marker — proposed copy, confirm wording |
| Studio photography | Whole page | Licensed stock (credited below); captions calling images "placeholder" were removed |

## Image credits (placeholder photography)

The shared footer (`site-chrome.js`) carries a short site-wide attribution naming the image sources in use
(currently Unsplash and Pexels). Per-photo credits and licences are listed below. If a page adds a new source,
update that footer line too.

**Rule: no image appears on more than one page** — Home 1, Home 2 and every inner page each have their own set (checked by path, photo ID and pixel fingerprint).

### Home 1 (`index.html`)

All images are hotlinked from Unsplash under the [Unsplash License](https://unsplash.com/license)
(free use; attribution appreciated, not required). Each is to be replaced with studio photography.

| Used in | Photo | Photographer |
|---|---|---|
| Hero | [Aerial silks performance on dark stage](https://unsplash.com/photos/n4KiW-TFerI) | Ahmad Odeh |
| Studio section | [Two aerialists perform gracefully on a hoop](https://unsplash.com/photos/z4B542l9eS4) | Jayanth Muppaneni |
| Disciplines — Silks | [Performer on red aerial silks](https://unsplash.com/photos/oF82bSqzuUY) | Igor Savelev |
| Training (main) | [Aerial routine with instructors watching](https://unsplash.com/photos/WLWnKV5egzg) | Centre for Ageing Better |
| Training (inset) | [Two women in a gymnasium with trapeze equipment](https://unsplash.com/photos/D_IUynjnR5Y) | Centre for Ageing Better |
| Performance | [Two acrobats performing aerial silks routine](https://unsplash.com/photos/r9wTQj27p8o) | Gerardo Martin Fernandez Vallejo |
| Community (wide) | [Two acrobats perform on a stage with abstract lights](https://unsplash.com/photos/J6ctfElqfqk) | Gerardo Martin Fernandez Vallejo |
| Community (tall) | [Acrobats perform on red aerial silks](https://unsplash.com/photos/IzsR6qr8Rb0) | Gerardo Martin Fernandez Vallejo |
| Community (small) | [Woman performing aerial acrobatics on trapeze rings](https://unsplash.com/photos/I_UWkXYFenY) | Centre for Ageing Better |

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
showed aerial-yoga hammocks, so Home 2 shows a clearly labelled "Photo needed" frame instead of misleading imagery.

### About (`about.html`)

Downloaded from Pexels into `assets/images/about/` under the [Pexels License](https://www.pexels.com/license/).
Each file exists at `-800.jpg` and `-1600.jpg`. Verified unique against Home 1 and Home 2 (path, photo ID and pixel fingerprint).

| File (`assets/images/about/`) | Used in | Source (Pexels) | Photographer (Pexels username) |
|---|---|---|---|
| `cover-monochrome-curtain` | I · Programme cover | [27239071](https://www.pexels.com/photo/a-black-and-white-photo-of-a-woman-doing-aerial-27239071/) | andersonportella |
| `story-red-silk-split` | II · The studio story | [32616630](https://www.pexels.com/photo/aerial-acrobat-performing-on-silk-ribbons-32616630/) | mykhailo-petrenko |
| `tension-symmetrical-hold` | III · Tension (left page) | [30131184](https://www.pexels.com/photo/aerial-silk-performer-in-dramatic-pose-on-stage-30131184/) | andersonportella |
| `release-purple-flow` | III · Release (right page) | [29576321](https://www.pexels.com/photo/circus-performer-on-aerial-silks-performing-stunt-29576321/) | alex-kihang-a |

**Not sourced:** a licensed photo of a real circus studio's rig, mats or training space (searches returned ship rigging
and industrial hardware). About section IV shows a labelled "Photo needed" frame instead.
