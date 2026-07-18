# Wedding Card Redesign — Design Spec

Date: 2026-07-19

## Purpose

Replace the current single, continuously-scrolling wedding site with a full-bleed,
page-by-page experience modeled on an Instagram-reel-style digital invite
("evitelb.com" style): each screen is its own full-photo background with minimal,
centered typography, navigated by native swipe/scroll rather than one long page.

Reference material reviewed: 6 reel screenshots (cover / verse+families / "LOVE"
phrase screen / venue detail boxes / RSVP accept-decline / thank-you gift screen)
and one Pinterest image of a flaming Sacred Heart of Jesus (crown of thorns, cloud
background) to use as the scratch-card texture.

Couple: Elias (groom, Bou Mrad Family) & Vanessa (bride, Abboud Family).
Wedding date: 28 August 2026, 6:00 PM.

## Architecture

**Navigation mechanism:** native CSS scroll-snap, not a custom JS-driven pager.

- Outer container: `overflow-y-scroll`, `snap-y snap-mandatory`, `h-screen` (or
  `100dvh` for mobile browser chrome).
- Each page: a `section` with `snap-start snap-always`, `h-screen`/`100dvh`,
  full-bleed background image + overlay, its own content.
- Rationale: reliable on all devices (trackpad, mouse wheel, touch swipe) without
  hijacking scroll events, which risks jank/accessibility issues on iOS Safari in
  particular. Chosen over a fully custom JS pager per user's explicit preference.

**Per-page content animation:**

- Each page's content block uses Framer Motion container variants with
  `staggerChildren`, driven by `whileInView` with `viewport={{ once: false, amount: 0.6 }}`
  — animations **replay every time** a page re-enters view (scrolling back up
  re-triggers the same pop-in), not just once.
- Individual elements (headline, subtext, names, panels) animate as staggered
  children: fade + translateY, matching the existing `FadeUp` pattern already in
  the codebase, extended to retrigger.
- Background image gets a subtle scale (e.g. 1.04 → 1) and overlay-opacity shift
  tied to the same in-view trigger, for a soft parallax-style transition as pages
  change.

**No page indicators** (dots/progress) — matches the reel's minimal look.

**Cover page** (replaces current `EnvelopeCard.tsx` envelope-graphic approach):

- Full-bleed placeholder photo background (not the illustrated envelope), dark
  gradient overlay.
- Centered "Open the Invitation" button, no personalized "Dear [Name]" greeting.
- Keeps existing tap → fade/blur exit transition and music-autostart-on-interaction
  behavior (`onInteraction` callback wired to `MusicPlayer`).

**Dropped from current site:** the "Before The Big Day" photo carousel/gallery
page (`PhotoGallery.tsx` usage removed from the flow — component file can remain
unused or be deleted during implementation).

**Kept unchanged:** floating `MusicPlayer` button/behavior; RSVP Google Apps
Script endpoint, payload shape, and `?names=` query-param guest-checklist logic
(`RSVPForm.tsx` internals reused, only visual wrapper changes to sit on a
full-bleed photo background instead of a plain section background).

## Pages (in order)

0. **Cover** — see above.

1. **"We love because…"** — full-bleed placeholder photo + dark overlay. Centered
   italic serif phrase (Cormorant Garamond), large, nothing else on the page.
   English only (no Arabic — replaces the current site's Arabic verse treatment).

2. **"…he loved us first" + families + names + scratch-reveal date**
   - Verse conclusion, same serif italic style, continuing the sentence from
     page 1.
   - Short invite line (small tracked caps), similar tone to current site's
     "Request the Honor of Your Presence" copy.
   - Family names row: "BOU MRAD FAMILY" / "ABBOUD FAMILY" side by side, small
     tracked caps.
   - Couple names: "Elias & Vanessa" in flowing script (Pinyon Script /
     `--font-script`), large, centered.
   - **Scratch card:** canvas-based scratch-off widget.
     - Scratchable top layer renders the Sacred Heart texture (adapted from
       `src/assets/sacred-heart.jpeg`, styled closer to the Pinterest reference —
       flaming heart, crown of thorns, radiant cloud background).
     - Touch/mouse drag erases the canvas via `globalCompositeOperation =
       "destination-out"`.
     - Underneath: "28 August 2026" in large serif + a small "Save the Date"
       caption, plus the existing `CountdownTimer` component (target
       `2026-08-28T18:00:00`).
     - Reveal triggers once a sampled-alpha check shows the canvas is
       sufficiently cleared (e.g. ≥ ~55%), auto-fading the remaining canvas out
       and fading in the date + countdown.
     - Small instructional micro-copy above the scratch area: "Scratch to reveal
       your wedding date" with a subtle pulsing hint animation (reusing the
       pulse style from the current "Tap to open" prompt).
     - **Required-but-not-blocking:** per user decision, guests are never
       physically prevented from scrolling past this page. The date/countdown
       are simply never rendered anywhere else on the site — skipping the
       scratch means never seeing the date. No scroll-lock is implemented.

3. **Church + Venue** — full-bleed placeholder photo + overlay. Two bordered info
   panels (thin white-line rectangles, matching the reel's "Wedding Party" /
   "Ceremony" box style):
   - "Ceremony" panel: placeholder church name, placeholder address, placeholder
     time, "Get Directions" placeholder link.
   - "Reception" panel: placeholder venue name, placeholder address, placeholder
     time, "Get Directions" placeholder link.
   - Placeholders styled exactly like real content (per user: "use placeholders
     for now" — same convention as the current site's "Our Lady of Peace Church" /
     "Lavender Ville" placeholders), clearly swappable later.

4. **Groom's Home + Bride's Home** — same full-bleed + two-panel layout as page 3,
   labeled "Groom's Home" / "Bride's Home", placeholder addresses + directions
   links.

5. **Wish Account** — full-bleed placeholder photo + overlay. "Thank You" script
   heading, small caps "Dear Family and Friends", italic message reused from the
   current `GiftRegistry` copy, Whish account card (copy-to-clipboard button
   retained) with a **placeholder account number**, relabeled "ELIAS & VANESSA".
   Restyled with light/white text to sit legibly over a photo background.

6. **RSVP (last page)** — full-bleed placeholder photo + overlay. Script "Please"
   + tracked "R S V P" heading, deadline micro-copy. Below it, the **existing**
   `RSVPForm` logic unchanged: reads `?names=` from the URL, per-guest toggle
   chips, Accept/Decline buttons, optional message textarea, POSTs to the same
   Google Apps Script URL (`GOOGLE_SCRIPT_URL` unchanged). Visual wrapper only
   changes to fit a full-bleed photo background (light/white text variant)
   instead of the current plain ivory section. If no `?names=` are present, the
   form renders nothing (same as current behavior) — not addressed further, as
   this matches existing production behavior.

## Content values

| Item | Value |
|---|---|
| Groom | Elias |
| Groom's family | Bou Mrad Family |
| Bride | Vanessa |
| Bride's family | Abboud Family |
| Wedding date | 28 August 2026 |
| Countdown target | 2026-08-28T18:00:00 |
| Verse | "We love because…" / "…he loved us first" (English only) |
| Whish account | Placeholder number (not the real account) |
| Church / Venue / Homes | Placeholder names, addresses, and map links |

## Fonts / palette

No new fonts or palette changes. Reuses existing CSS variables and font stack
from `src/index.css`: `--font-heading` (Cormorant Garamond), `--font-amelia`
(Bodoni Moda), `--font-script` (Pinyon Script), `--font-sans` (Montserrat),
dusty-blue / cream / ivory theme colors. The Arabic font stack
(`--font-arabic`, `--font-arabic2`) is no longer used on these pages since the
verse is English-only now.

## Out of scope / explicitly dropped

- Photo gallery/carousel page.
- Personalized "Dear [Name]" cover greeting.
- Page position indicators (dots/progress bar).
- Hard scroll-lock gating on the scratch card.
- Real church/venue/home addresses and the real Whish account number (left as
  placeholders for the user to fill in).
