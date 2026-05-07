# Lyrica Landing Design System

Source moodboard: `../index.html` final moodboard slides 17-24.

Reference pages analyzed:

- Chanel J12: https://www.chanel.com/us/watches/the-j12-watch/
- Audemars Piguet RD#5: https://www.audemarspiguet.com/com/en/watch/royal-oak-jumbo-extra-thin-selfwinding-flying-tourbillon-chronograph-rd5.html
- NewMix: https://www.newmixcoffee.com/en
- iCOMAT: https://www.icomat.co.uk/

Working direction: **The Quiet Return**.

Lyrica should feel precise, hushed, cinematic, and privately memorable. The landing page should behave like a ritual surface: measured, low-noise, tactile, image-led, and exact.

## Core Rules

- Use **Instrument Sans only** for all live text.
- Do not introduce a secondary text face.
- Keep `letter-spacing: 0` everywhere.
- Do not use viewport-scaling type such as `vw` type or fluid `clamp()` type. Use breakpoint-specific tokens.
- Use fewer type sizes per screen than feels necessary.
- A single viewport may use **maximum 3 type roles**: `Label + one major role + one reading role`.
- Italic is not used anywhere in the Lyrica landing system.
- Font weight is limited to **200** and **400** only.
- **Minimum type size is 14px** at every breakpoint. No live text — including Label, Data, captions, nav, or footnotes — may render below 14px.
- Specs do not get their own size. Specs use Body size with `400` weight and tabular numbers.
- Prefer manual line breaks over adding another text size.
- **No widows. A line never ends with a single isolated word.** Wrapped text must keep at least two words on every line, including the last. Use `text-wrap: balance` for Display, Title, and Label; use `text-wrap: pretty` for Body and Data. When a wrap is unavoidable, insert a `&nbsp;` between the last two words to keep them locked together.
- Do not show section chapter labels or numbered section headings; they read like a pitch deck.
- The Swiss grid is a layout system, not a visible background graphic. Do not draw column guide lines behind content.
- Motion must have a material reason: reveal, mix, trace, measure, or settle.
- Avoid always-on spectacle. State changes should carry the motion; ambient motion should stay barely perceptible.

## Reference Typography Takeaways

### Chanel J12

Chanel uses a very small hierarchy. The first impression is mostly brand mark, a massive product name, small navigation, and extreme negative space. The page does not need many text levels because `J12` itself becomes the visual object.

What Lyrica should borrow:

- One typographic object can carry the whole viewport.
- Small uppercase labels work only when they are short and sparse.
- The page should not explain everything at once.
- High contrast and silence are part of the type system.

### Audemars Piguet RD#5

AP uses more editorial storytelling than Chanel, but still does not overload a single section with many type sizes. A screen usually has one large phrase and one paragraph rhythm. Technical content is readable because it is spaced and line-broken, not because it has many hierarchy levels.

What Lyrica should borrow:

- Use one large editorial phrase per major section.
- Give technical copy generous line height.
- Break long product names by meaning.
- Let dark sections carry technical proof.

## Reference Interaction And Motion Takeaways

### NewMix

Observed behavior:

- The hero starts as a direct interaction: the user is invited to "Drag to mix."
- Dragging physically disturbs the typographic/image surface, creating a powdery smear and material transformation.
- After the hero, the page flips from black to a textured off-white editorial surface.
- The scroll story uses a centered vertical axis, small dots, dotted paths, circular paths, and image beats.
- Images appear as evidence in a tactile sequence rather than as generic cards.
- The layout is playful, but the system is still disciplined: few colors, large pauses, strong contrast.

What Lyrica should borrow:

- One tactile hero interaction can make the brand memorable.
- Scroll can feel like following a trace, not just moving down a page.
- A central axis can create ritual and sequence.
- Texture can make a page feel physical.
- Product/world imagery can be introduced as fragments before becoming a full object.

What Lyrica should not borrow directly:

- Do not use messy powder, playful smearing, or novelty cursor behavior literally.
- Do not make every section interactive.
- Do not let the interaction feel like a game.

### iCOMAT

Observed behavior:

- The hero uses full-bleed macro video/image material with type anchored over it.
- The first scroll converts a dark cinematic hero into a bright technical explanation field.
- Technical modules use precision frames, corner ticks, grid points, translucent glass controls, and object-like buttons.
- Cards and menu panels feel engineered: image thumbnail, label, frosted surface, clear hit area.
- Dark sections use layered overlays and floating labels to make the product/technology feel measurable.
- The interaction language is high-tech, but the motion is controlled and purposeful.

What Lyrica should borrow:

- Use macro material as the hero stage.
- Use precision frames and corner ticks to make watch details feel measured.
- Use glass or translucent controls sparingly for interactive states.
- Let scroll transform a cinematic image into a technical proof section.
- Use hover/reveal states that feel engineered, not decorative.

What Lyrica should not borrow directly:

- Do not use large rounded sci-fi controls as-is.
- Do not make the watch page feel like aerospace software.
- Do not overload the page with too many technical modules before emotion is established.

### Chanel / AP Luxury Filter

NewMix and iCOMAT provide interaction mechanics. Chanel and Audemars Piguet provide restraint.

For Lyrica, this means:

- NewMix-style tactile interaction should become **quiet ritual**, not play.
- iCOMAT-style technical framing should become **watchmaking precision**, not industrial dashboard.
- Chanel-style negative space should remain the default pacing.
- AP-style macro imagery should carry depth, but copy hierarchy should stay minimal.

## Motion Principles

Motion direction: **trace, reveal, settle**.

Use motion to answer one of these questions:

- Where did the object come from?
- What changed as I touched or scrolled?
- Which detail should I inspect?
- How does the mechanism or material reveal itself?

Do not use motion only to make the page feel busy.

## Motion Tokens

```css
:root {
  --motion-xs: 160ms;
  --motion-sm: 260ms;
  --motion-md: 620ms;
  --motion-lg: 980ms;
  --motion-xl: 1400ms;

  --ease-return: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-ritual: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-measured: cubic-bezier(0.65, 0, 0.35, 1);
  --opacity-linear: linear;
}
```

Usage:

| Token | Use |
| --- | --- |
| `--motion-xs` | Hover color, label opacity, icon state |
| `--motion-sm` | Button press, menu item hover, small image lift |
| `--motion-md` | Section reveal, text settle, card reveal |
| `--motion-lg` | Hero image settle, macro crop transition, detail reveal |
| `--motion-xl` | One-off hero ritual, scroll phase transition |

## Interaction Patterns

### Hero Trace

Inspired by NewMix drag, but translated for Lyrica.

Behavior:

- A single first-viewport interaction lets the user drag, scrub, or trace across the hero.
- The interaction should reveal watch detail, dial geometry, light sweep, or a remembered image layer.
- The page must still be beautiful if the user never interacts.
- The gesture should last one viewport only.

Lyrica examples:

- Drag across a dark macro image to reveal the dial beneath a soft scrim.
- Scrub a small arc that moves like a watch hand.
- Trace a fine line that resolves into the LR monogram.

Rules:

- Use once per page.
- No messy particle explosions.
- No playful cursor trail.
- No required interaction for core content.

### Scroll Trace

Inspired by NewMix's centered path and iCOMAT's technical scroll modules.

Behavior:

- A thin line, dot, or arc connects section beats.
- The trace can move from vertical editorial axis to circular watch geometry.
- The trace should feel like measurement or ritual, not decoration.

Rules:

- Keep the trace hairline-thin.
- Use `Lyrica Ink`, `Paper Bone`, or low-opacity Stone Mist.
- Ember Memory may appear only as one active point.
- Disable or simplify under reduced motion.

### Precision Frame

Inspired by iCOMAT's framed technical modules.

Behavior:

- Technical product sections sit inside a measured frame with corner ticks.
- The frame can reveal on scroll by drawing the hairlines in sequence.
- The content inside should be still or nearly still.

Rules:

- Radius `0` to `4px`.
- Use corner ticks instead of decorative borders.
- Hover may reveal one secondary detail, not a full animation cascade.

### Macro To Proof

Inspired by AP and iCOMAT.

Behavior:

- A full-bleed macro image gives emotional depth.
- On scroll, the next section resolves into technical proof: case, dial, movement, material.
- The transition can crossfade, scale down, or mask into a measured frame.

Rules:

- Use this once or twice.
- Keep copy hierarchy to `Label + Title + Body`.
- Do not stack multiple moving images in one viewport.

### Gallery River

Inspired by NewMix's image sequence.

Behavior:

- A sequence of image fragments flows horizontally or vertically.
- The gallery should feel like collected evidence from the Lyrica world.
- Motion is scroll-linked, but low amplitude.

Rules:

- Use monochrome or near-monochrome images.
- Avoid uneven masonry chaos.
- The sequence should resolve into one strong product or brand image.

### Menu Overlay

Inspired by iCOMAT's frosted navigation panel, filtered through Chanel restraint.

Behavior:

- The menu opens as a calm full-screen or near-full-screen overlay.
- Links are large hit areas with restrained image thumbnails or hairline dividers.
- Background may blur, but should not become cloudy or decorative.

Rules:

- Use fewer menu items than iCOMAT.
- Radius max `8px`.
- No bouncing menu items.
- Opening motion: opacity + 8-12px settle.

## Layout System

The Lyrica landing page uses a strict Swiss grid. Every section must be built on the same rails before any visual exception is considered.

### Swiss Grid Tokens

Desktop:

```css
:root {
  --grid-columns: 12;
  --grid-margin: 32px;
  --grid-gutter: 24px;
  --section-pad-y: 112px;
}
```

Tablet:

```css
@media (min-width: 600px) and (max-width: 1023px) {
  :root {
    --grid-columns: 12;
    --grid-margin: 28px;
    --grid-gutter: 18px;
    --section-pad-y: 96px;
  }
}
```

Mobile:

```css
@media (max-width: 599px) {
  :root {
    --grid-columns: 4;
    --grid-margin: 18px;
    --grid-gutter: 12px;
    --section-pad-y: 72px;
  }
}
```

Base section shell:

```css
.section {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  column-gap: var(--grid-gutter);
  padding-inline: var(--grid-margin);
  padding-block: var(--section-pad-y);
}
```

### Spacing Tokens

Spacing stays on a 4px base grid. Section and component spacing should use tokens unless a value describes object geometry.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
  --space-8: 32px;
  --space-9: 36px;
  --space-10: 40px;
  --space-11: 44px;
  --space-12: 48px;
  --space-13: 52px;
  --space-14: 56px;
  --space-18: 72px;
  --space-24: 96px;
  --space-28: 112px;
}
```

Rules:

- Use `--space-11` for minimum touch target height or width.
- Use `--space-10` through `--space-14` for visual module offsets.
- Keep optical object proportions local to the object component.
- Do not invent one-off gaps like `14px`, `22px`, `34px`, or `42px` for layout.

### Surface And Layer Tokens

```css
:root {
  --text-muted-light: rgba(14, 14, 14, 0.68);
  --text-soft-light: rgba(14, 14, 14, 0.78);
  --text-muted-dark: rgba(236, 237, 228, 0.68);
  --text-soft-dark: rgba(236, 237, 228, 0.78);
  --line-light: rgba(14, 14, 14, 0.16);
  --line-dark: rgba(236, 237, 228, 0.18);
  --surface-line-light: rgba(14, 14, 14, 0.12);
  --surface-line-dark: rgba(236, 237, 228, 0.16);
  --surface-object-shadow: 0 32px 80px rgba(14, 14, 14, 0.12);
  --surface-object-shadow-dark: 0 38px 90px rgba(0, 0, 0, 0.34);
  --z-video: 0;
  --z-overlay: 1;
  --z-atmosphere: 2;
  --z-content: 3;
  --z-cursor: 4;
}
```

Rules:

- The source video is unfiltered; the frosted material lives in the overlay.
- Use surface tokens for borders and quiet product objects.
- Use layer tokens for all hero media, overlay, atmosphere, content, and cursor layers.

Rules:

- Desktop sections use 12 columns.
- Mobile sections collapse to 4 columns.
- Desktop column `1` and column `12` are margin rails; primary content starts at column `2` and ends before the final rail unless the section is intentionally full-bleed.
- Content must align to column lines, not arbitrary percentages.
- Primary title/body content starts at column `5` by default.
- Center alignment is allowed only when the block itself is still locked to grid columns.
- Section chapter labels are not shown; hierarchy comes from title placement, copy rhythm, and negative space.
- Grid rails must remain invisible on the page surface.
- No floating cards inside sections.
- No section-specific padding unless the grid tokens fail at a breakpoint.

### Layout A: Frosted Hero Poster

Use for hero and final close.

- Full viewport or near-full viewport.
- Background media is full-bleed.
- A single frosted overlay sits above the media and below content.
- Navigation occupies the full grid row.
- Logo sits on columns `1 / span 2`.
- Menu sits on columns `9 / span 4`, aligned right.
- Hero statement sits on columns `2 / span 4`, left aligned.
- Hero metadata sits on columns `6 / span 2`.
- No free-positioned copy except background media and overlay layers.
- Pointer response is led by the frosted material layer, not by copy movement.
- Copy shift stays weak: max `3px`, tilt under `1deg`, delayed by lerped motion.
- The frosted layer uses one deforming CSS mask aperture: the area around the pointer relaxes blur while one slower pull point changes that aperture's center and proportion.
- The aperture must keep some blur at its center; never expose a hard circular hole.
- Copy fragments near the pointer may blur locally, but the full text block should remain readable.
- Do not stack multiple aperture shapes. Use one blur aperture only; avoid canvas unless the effect is re-budgeted and clearly improves the material.
- Fine-grain movement is limited to lightweight CSS background-position shifts.
- All material effects are overlays; the source video is never filtered.
- Respect `prefers-reduced-motion`; the hero remains static when motion is reduced.

Reference blend:

- Chanel negative space.
- AP macro image.
- NewMix one memorable gesture.

### Layout B: Ritual Axis

Use for brand philosophy and transition sections.

- Label: columns `2 / span 2`.
- Main statement: columns `5 / span 6`.
- Optional body: columns `5 / span 4`.
- One image or statement per beat.
- Dots, hairlines, or circular path must align to a grid column.
- The axis should explain sequence: received -> remembered -> returned to.

Reference blend:

- NewMix scroll path.
- Chanel restraint.

### Layout C: Precision Proof

Use for case, dial, movement, material, and finish.

- Label: columns `2 / span 2`.
- Title: columns `5 / span 5`.
- Body: columns `5 / span 4`.
- Detail image/spec area may use columns `9 / span 3`.
- Corner ticks, hairlines, tabular numbers.

Reference blend:

- iCOMAT frames.
- AP technical storytelling.

### Layout D: Dark Mechanism

Use for the most technical or cinematic section.

- Dark full-width band.
- Macro material imagery.
- Floating labels or callouts.
- Sparse text.
- The same 12-column grid remains active on dark surfaces.
- Technical labels should not drift outside columns.

Reference blend:

- iCOMAT dark engineering modules.
- AP macro watch imagery.

### Layout E: Collected World

Use for visual mood and brand world.

- Controlled gallery sequence.
- Alternating image scale.
- No chaotic masonry.
- End with product/wordmark lockup.
- Image widths must snap to column spans: 3, 4, 6, 8, or 12.

Reference blend:

- NewMix gallery flow.
- Chanel product discipline.

## Lyrica Typography Principle

The previous version had too many roles. Lyrica now uses **four public roles** plus one compact data role:

1. `Display`
2. `Title`
3. `Body`
4. `Label`
5. `Data`, used only for compact detail copy, rolling time labels, and small product evidence.

There is no separate `Hero`, `Statement`, `Sublead`, or `Spec` size. Those are usage contexts, not new type scales. A single viewport still uses a maximum of three roles at once.

## Font System

```css
font-family: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;
font-optical-sizing: auto;
letter-spacing: 0;
```

Allowed weights:

| Token | Weight | Use |
| --- | ---: | --- |
| `--weight-light` | `200` | Body, data, longer reading |
| `--weight-regular` | `400` | Display, title, labels, nav, CTA, specs |

No Italic Rule:

- Do not import the italic axis.
- Do not use `font-style: italic`.
- Do not use `<em>` for visual styling.
- Emphasis is created through line break, position, color, or timing, not a new font style.

## Final Type Scale

Desktop:

| Role | Token | Size | Line Height | Weight | Use |
| --- | --- | ---: | ---: | ---: | --- |
| Display | `--type-display` | `112px` | `0.94` | `400` | Product name, hero object, final statement |
| Title | `--type-title` | `48px` | `1.08` | `400` | Section title or editorial phrase |
| Body | `--type-body` | `17px` | `1.62` | `200` | Reading, product detail |
| Data | `--type-data` | `14px` | `1.50` | `200` or `400` | Detail copy, small evidence, rolling time labels |
| Label | `--type-label` | `14px` | `1.28` | `400` | Nav, caption, metadata, material tag |

Tablet:

| Role | Size | Line Height |
| --- | ---: | ---: |
| Display | `84px` | `0.96` |
| Title | `40px` | `1.10` |
| Body | `17px` | `1.60` |
| Data | `14px` | `1.50` |
| Label | `14px` | `1.28` |

Mobile:

| Role | Size | Line Height |
| --- | ---: | ---: |
| Display | `56px` | `1.00` |
| Title | `32px` | `1.12` |
| Body | `16px` | `1.58` |
| Data | `14px` | `1.50` |
| Label | `14px` | `1.30` |

The 14px floor is absolute. Label and Data share the same minimum size and are differentiated by treatment: Label is uppercase weight `400`; Data is sentence case with `tabular-nums`.

## CSS Token Draft

```css
:root {
  --font-main: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;

  --weight-light: 200;
  --weight-regular: 400;

  --type-display: 112px;
  --type-title: 48px;
  --type-body: 17px;
  --type-data: 14px;
  --type-label: 12px;
  --type-hero: var(--type-display);
  --type-section-title: var(--type-title);
  --type-reading: var(--type-body);
  --type-caption: var(--type-label);

  --lh-display: 0.94;
  --lh-title: 1.08;
  --lh-body: 1.62;
  --lh-data: 1.5;
  --lh-label: 1.28;
  --lh-hero: var(--lh-display);
  --lh-section-title: var(--lh-title);
  --lh-reading: var(--lh-body);
  --lh-caption: var(--lh-label);
}

body {
  font-family: var(--font-main);
  font-weight: var(--weight-light);
  letter-spacing: 0;
}
```

Tablet breakpoint:

```css
@media (min-width: 600px) and (max-width: 1023px) {
  :root {
    --type-display: 84px;
    --type-title: 40px;
    --type-body: 17px;
    --type-data: 14px;
    --type-label: 12px;
  }
}
```

Mobile breakpoint:

```css
@media (max-width: 599px) {
  :root {
    --type-display: 56px;
    --type-title: 32px;
    --type-body: 16px;
    --type-data: 13px;
    --type-label: 11px;
  }
}
```

## Type Classes

### Display

```css
.type-display {
  font-size: var(--type-hero);
  line-height: var(--lh-hero);
  font-weight: var(--weight-regular);
  letter-spacing: 0;
}
```

Use for:

- Hero object.
- Product/model name.
- Final emotional statement.

Rules:

- Maximum 3 lines.
- Maximum 9 words.
- Do not pair with Title in the same viewport.
- If Display is present, the only other live text should be Label and Body.

Example:

```text
Received.
Remembered.
Returned to.
```

### Title

```css
.type-title {
  font-size: var(--type-section-title);
  line-height: var(--lh-section-title);
  font-weight: var(--weight-regular);
  letter-spacing: 0;
}
```

Use for:

- Section openings.
- Product/craft module headlines.
- Editorial phrases when Display would be too loud.

Rules:

- Maximum 2 lines.
- Do not pair with Display in the same viewport.
- Pair with Body for product/craft sections.
- Pair with Data only for compact proof or metadata.

Example:

```text
Precision without performance.
```

### Data

```css
.type-data {
  font-size: var(--type-data);
  line-height: var(--lh-data);
  font-weight: var(--weight-light);
  font-variant-numeric: tabular-nums lining-nums;
  letter-spacing: 0;
}
```

Use for:

- Rolling time labels.
- Detail descriptions beside technical objects.
- Compact product evidence and certificate text.

Rules:

- Keep Data out of emotional narrative blocks.
- Use `400` only when the value behaves like a label or specification key.
- Never use Data as a paragraph substitute.

Example:

```text
38 MM
FROSTED DIAL
```

### Body

```css
.type-body {
  font-size: var(--type-reading);
  line-height: var(--lh-reading);
  font-weight: var(--weight-light);
  letter-spacing: 0;
}
```

Use for:

- Paragraphs.
- Product details.
- Technical explanations.
- Supporting specification values.

Rules:

- Max width: `620px`.
- Paragraphs should be 2-4 sentences.
- Specs may use Label or Data when they are table entries; longer explanations stay Body.

Spec modifier:

```css
.type-body.is-spec {
  font-weight: var(--weight-regular);
  line-height: var(--lh-data);
  font-variant-numeric: tabular-nums lining-nums;
}
```

### Label

```css
.type-label {
  font-size: var(--type-caption);
  line-height: var(--lh-caption);
  font-weight: var(--weight-regular);
  letter-spacing: 0;
  text-transform: uppercase;
}
```

Use for:

- Navigation.
- Captions.
- Metadata.
- Material tags.
- Button text.

Rules:

- Maximum 4 words.
- Uppercase only for short labels.
- Never use Label as a mini paragraph.

## Per-Section Type Recipes

Each section must pick one recipe. Do not mix recipes inside the same viewport.

### Recipe A: Frosted Hero Poster

Use for hero, product reveal, or final close.

Allowed roles:

- Title
- Body, optional

Do not use:

- Label
- Display
- Data, unless it is part of the clock evidence layer

Example:

```text
TITLE:
Received.
Remembered.
Returned to.

BODY:
Some objects do not pass through time.
They gather it.
```

### Recipe B: AP Editorial Pause

Use for the one large reading pause after the hero.

Allowed roles:

- Label, optional
- Body

Do not use:

- Display
- Title
- Data in the same visible block

Example:

```text
BODY: Lyrica is built for people who read time as a private ritual,
not a public performance.
```

### Recipe C: Product Proof

Use for material, movement, craft, design, and care sections.

Allowed roles:

- Label
- Title
- Body

Do not use:

- Display
- Data, unless it is part of a compact proof table

Example:

```text
LABEL: CASE
TITLE: Cut for quiet presence.
BODY: Brushed planes, polished edges, and a slim profile keep the object exact without asking for attention.
```

### Recipe D: Specification Table

Use for dimensions, caliber, case, water resistance, and availability.

Allowed roles:

- Label
- Body with `.is-spec`

Do not use:

- Display
- Title
- Data, unless the table needs compact technical values

Example:

```text
LABEL: CASE SIZE
BODY/SPEC: 38 mm
```

## Composition Rules

### One-Screen Hierarchy Limit

Never show more than:

- 1 major role: Display or Title.
- 1 reading role: Body.
- 1 metadata role: Label or Data.

If a section feels like it needs more hierarchy, split the section.

### Alignment

- Center alignment is reserved for Recipe A and Recipe B.
- Left alignment is the default for Recipe C and Recipe D.
- Right alignment should be metadata only.

### Line Breaks

- Break Display and Title manually.
- Break long product names by meaning, not by equal line length.
- Never leave a single word stranded on its own line ("widow"). Every wrapped line, including the final line, must hold at least two words.
- Default enforcement: `text-wrap: balance` on Display, Title, Label; `text-wrap: pretty` on Body and Data.
- Manual override when balance fails: insert `&nbsp;` between the last two words to keep them on the same line.
- Manual line breaks (`<br>` or `<span>`-per-line patterns) take precedence over `text-wrap` and must already obey the no-widow rule.

Example:

```text
Extra-Thin Selfwinding
Flying Tourbillon Chronograph
```

### Case

- Brand/object names: exact brand or model case.
- Section titles: sentence case.
- Labels/nav: uppercase only if short.
- Body: sentence case.

## Color Context For Type

Primary palette:

| Token | Hex | Typography Use |
| --- | --- | --- |
| Paper Bone | `#ECEDE4` | Main light surface; whiter, greyer, faintly green, softly warm |
| Quiet White | `#F7F8F3` | Hero glass and high-key surface tint |
| Stone Mist | `#9A928A` | Muted text, secondary metadata |
| Lyrica Ink | `#0E0E0E` | Primary text, dark surface |
| Ember Memory | `#9A5A35` | Sparse emphasis, active state |

Contrast rules:

- On Paper Bone, primary text is Lyrica Ink.
- On Lyrica Ink, primary text is Paper Bone.
- Stone Mist is for secondary information only.
- Ember Memory should never carry a full paragraph.
- Ember Memory should appear in one type role per viewport at most.

## Copy Rules

Use:

- "Some objects do not pass through time. They gather it."
- "Received. Remembered. Returned to."
- "Precision without performance."
- "A ritual, not a status object."
- "Built for private attention."

Avoid:

- "timeless elegance"
- "redefining luxury"
- "crafted for those who dare"
- "elevate your everyday"
- long founder-story paragraphs

## Implementation Checklist

- All live text uses Instrument Sans.
- No secondary font imports.
- `letter-spacing` remains `0`.
- No viewport-fluid type.
- Minimum type size is 14px at every breakpoint.
- No widows: every wrapped line, including the last, has 2+ words. Display/Title/Label use `text-wrap: balance`; Body/Data use `text-wrap: pretty`.
- Only five type tokens exist.
- No separate spec, sublead, or statement token exists.
- Each viewport uses one recipe.
- Every section uses the Swiss grid shell.
- Desktop sections use 12 columns; mobile sections use 4 columns.
- No visible section chapter labels.
- No visible grid-line backgrounds.
- Primary copy starts at column 5 on desktop unless the section has a specific composition rule.
- A viewport has no more than one major type role.
- Hero type has manual line breaks.
- Body copy max width is enforced.
- Labels are short if uppercase.
- Italic is not used.
- CSS uses only `200` and `400` font weights.
- Specs use Body size with tabular numbers.
- Text never sits on busy imagery without a scrim.
- Mobile type uses breakpoint tokens, not automatic scaling.
- One page has no more than one bespoke interaction.
- One viewport has no more than one moving image layer.
- Ambient loops are low-amplitude and optional.
- State-change motion is more important than decorative looping motion.
- Reduced motion disables drag trails, scroll-linked traces, and long image drift.
- Interactive controls remain usable without hover, drag, or scroll choreography.
- Layout uses one of the defined layout recipes before inventing a new composition.
