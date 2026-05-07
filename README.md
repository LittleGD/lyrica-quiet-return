# Lyrica — *The Quiet Return*

A landing page exploration for Lyrica, a contemporary Swiss watch house designed for "quiet ambition." This repository is a portfolio case study: a self-directed brand and motion exercise built from a moodboard to a working prototype, including a written design system that the code is held against.

> *Some objects do not pass through time. They gather it.*

---

## Why this project

Most luxury watch sites I looked at (Chanel J12, Audemars Piguet RD#5, NewMix, iCOMAT) lean on either restraint or spectacle. Lyrica is an exercise in trying to hold both at once — a page that behaves like a ritual surface rather than a marketing brochure. The brief I gave myself:

- One typeface, two weights. No italics. No fluid type.
- Motion has to mean something — reveal, trace, settle. No ambient spectacle.
- The user can never lose where they are. Sticky and scrub effects must feel inevitable, not surprising.
- Every interaction has a material reason. One bespoke gesture per page, max.

The result is a single-page site that acts like a slow conversation — the watch is introduced, observed in detail, then handed over.

## What's here

```
landing-prototype/
├── index.html          ← the page
├── styles.css          ← ~2,500 lines, token-driven
├── script.js           ← vanilla JS, no framework
├── DESIGN_SYSTEM.md    ← the design system the code is held against
└── assets/
    ├── observe-frames-v1/   scroll-scrubbed watch detail frames
    └── craft-frames-v1/     scroll-scrubbed assembly frames

final-src-branding/     logo lockups, hero loop video, watch renders
snap/                   editorial gallery imagery
```

The page is plain HTML/CSS/JS. No build step, no dependencies. Open `landing-prototype/index.html` over any static server.

## Tour

| Section | What it does |
|---|---|
| **Hero** | A frosted glass aperture follows the cursor. Pull-blur reveals a silver dial through fog. Live clock embedded in the typography. |
| **a Watch. a Ritual. a Memory.** | Brand thesis on a Display-scale poster. A second logo trails the cursor with inertia (skewed by velocity, top and bottom on different lerp rates). |
| **The First Collection** | Three watches side-by-side. Subtle scroll-driven scale and lift on each card. |
| **Silence / Gesture** | A frosted dial sits behind the words "silence" and "gesture." A live time readout ticks underneath, masked by the glass. |
| **Observe the Details** | Sticky scrub through 81 frames per detail (case → dial → crown → strap → case back). Detail labels animate in/out with scroll progress. |
| **Mechanical by Nature** | Sticky scrub through an exploded-view assembly sequence. Image fades and scales in well before the section locks — no abrupt sticky transition. |
| **Snap Gallery** | A vertical river of 27 editorial frames. Each tile parallaxes and re-focuses as it crosses the viewport center. |
| **The Ritual Begins Before the First Wear** | An ownership ritual sequence — six lines, scroll-revealed one at a time, anchored to the same column as the third proof card. |
| **Begin a Private Inquiry** | Two contact actions. No form on the page itself — preserves the "private" register. |
| **Footer** | Pointer-tracked logo and link shifts. Subtle. |

## Design system

The page is built against [`landing-prototype/DESIGN_SYSTEM.md`](./landing-prototype/DESIGN_SYSTEM.md). Highlights:

- **One face, two weights** — Instrument Sans 200 / 400. No italics.
- **Five type tokens** — Display, Title, Body, Data, Label. No bespoke sizes. 14px floor on every breakpoint.
- **No widows** — `text-wrap: balance` on Display/Title/Label, `text-wrap: pretty` on Body/Data. Manual `&nbsp;` between last two words when the rule fails to.
- **Five colors** — Paper Bone (light surface), Quiet White (hero glass), Stone Mist (muted), Lyrica Ink (dark), Ember Memory (sparse accent only).
- **Five motion tokens** — 160 / 260 / 620 / 980 / 1400 ms. Three eases — `--ease-return`, `--ease-ritual`, `--ease-measured`. One linear for opacity.
- **Swiss grid** — 12 columns desktop / 4 columns mobile, 4px base spacing, no visible grid lines, primary content starts at column 5 unless the section overrides intentionally.
- **Reduced motion** — fully respected. Sticky scrub falls back to a static grid; pointer-tracked motion neutralizes in CSS and JS; the live clock polls once per minute.

## Notes on motion

Every scroll-linked or pointer-linked update goes through requestAnimationFrame and stops the moment the values settle (the script has a "tween settled?" check after every frame). The page is silent when nothing is moving.

Two interactions are worth calling out specifically:

- **Hero aperture.** The frosted overlay's mask-image is a single radial-gradient ellipse that follows the cursor with two-rate interpolation: a fast "pointer" point and a slower "pull" point. Together they keep the aperture from feeling like a flashlight cursor.
- **Brand-follow inertia.** The logo trailing the cursor in the brand-statement section uses different lerp rates on the X and Y axes, plus a velocity-driven skewX that applies a small angular lag. The top of the logo trails behind motion; the bottom catches up faster. It reads as physical without using a physics engine.

## Things I'd still revisit

This is a prototype. A production version would need:

- **Asset optimization.** The frame sequences are JPEGs at full resolution. WebP and adaptive resolution per device, or a video-scrubbing approach, would cut the page weight significantly.
- **Asset paths.** The HTML still references `../final-src-branding/` and `../snap/` relative to `landing-prototype/`. For a real deploy, assets should live inside the prototype directory (or behind a build step).
- **Layout thrashing.** A few of the scroll-driven update functions read `getBoundingClientRect()` per card per frame. Caching positions on resize + IntersectionObserver would help on slower devices.
- **Browser compatibility for `text-wrap: balance`/`pretty`.** Falls back to default wrapping on older browsers — no breakage, just no widow protection.

## Credits

Design, motion, and code: me. References: Chanel J12, Audemars Piguet RD#5, NewMix Coffee, iCOMAT. The brand voice and naming, the watch renders, and the hero/assembly footage were created for this exploration.

This is an unpaid concept project, not affiliated with any actual watch brand.
