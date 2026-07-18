# Wedding Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single continuously-scrolling wedding site with a full-bleed, page-by-page experience (cover + 6 pages) navigated by native scroll-snap, including a required-to-scratch Sacred Heart scratch card that reveals the wedding date.

**Architecture:** A new `RevealSection` primitive (full-bleed photo background + Framer Motion stagger-on-view content, re-triggering every time a page re-enters view) composes each page inside a `snap-y snap-mandatory` scroll container in a rewritten `WeddingDetails.tsx`. A new pure module (`scratchReveal.ts`) computes how much of a canvas has been cleared; `ScratchCard.tsx` wraps that logic in a pointer-driven canvas. Content (names, dates, placeholder venues) lives in one central `weddingContent.ts` module. Existing `RSVPForm`, `GiftRegistry`, and `CountdownTimer` are reused with minimal changes (a `variant="light"` prop for the first two) so the Google Sheets RSVP flow is untouched.

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind CSS (built-in `snap-*` utilities), Framer Motion, Vitest + @testing-library/react + jsdom.

## Global Constraints

- Reuse existing fonts/theme only — `'Cormorant Garamond'`, `var(--font-amelia)` (Bodoni Moda), `var(--font-script)` (Pinyon Script), `'Montserrat'`, and the `dusty-blue`/`cream`/`ivory` CSS variables from `src/index.css`. No new fonts.
- RSVP Google Apps Script endpoint stays exactly: `https://script.google.com/macros/s/AKfycbz5JtiSLlCth_McxFSoy7FLPxY4VIDoHpMFJKix_wADo9ugx4PnTXE_ws-iWv8Xu1Isbw/exec`, with the same POST payload shape (`name`, `attendees`, `attendance`, `message`, `date`) and the same `?names=` query-param guest-checklist behavior.
- Couple/family names: groom **Elias** (**Bou Mrad Family**), bride **Vanessa** (**Abboud Family**).
- Wedding date: **28 August 2026**; countdown target **2026-08-28T18:00:00**.
- The scratch card is required-but-not-blocking: the date/countdown must never render anywhere except beneath the scratch layer, but scrolling past the page is never physically blocked.
- No page-position indicators (dots/progress bars). No personalized "Dear [Name]" cover greeting. No photo gallery/carousel page.
- Church, venue, and both homes use clearly-fake placeholder text/addresses/map links. The Whish account number is a placeholder (`00000000-00`), not the real number.
- **Do not run `git add`/`git commit`, and do not create any git branches for this work** (explicit user instruction). Leave all changes uncommitted in the working tree — skip every "commit" step a task would normally end with.

---

### Task 1: Central content constants

**Files:**
- Create: `src/lib/weddingContent.ts`
- Test: `src/lib/weddingContent.test.ts`

**Interfaces:**
- Produces: `COUPLE: { groomFirstName: string; groomFamily: string; brideFirstName: string; brideFamily: string }`, `WEDDING_DATE_ISO: string`, `WEDDING_DATE_DISPLAY: string`, `VenueDetail` (interface: `{ label: string; name: string; address: string; time: string; mapHref: string }`), `CEREMONY_VENUE: VenueDetail`, `RECEPTION_VENUE: VenueDetail`, `GROOM_HOME: VenueDetail`, `BRIDE_HOME: VenueDetail`, `WHISH_ACCOUNT: { number: string; label: string }`. All later tasks import from this module — no other file should hardcode these values.

- [ ] **Step 1: Write the failing test**

Create `src/lib/weddingContent.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  COUPLE,
  WEDDING_DATE_ISO,
  CEREMONY_VENUE,
  RECEPTION_VENUE,
  GROOM_HOME,
  BRIDE_HOME,
  WHISH_ACCOUNT,
} from "./weddingContent";

describe("weddingContent", () => {
  it("has the correct couple and family names", () => {
    expect(COUPLE.groomFirstName).toBe("Elias");
    expect(COUPLE.groomFamily).toBe("Bou Mrad Family");
    expect(COUPLE.brideFirstName).toBe("Vanessa");
    expect(COUPLE.brideFamily).toBe("Abboud Family");
  });

  it("targets 28 August 2026 at 6:00 PM for the countdown", () => {
    expect(WEDDING_DATE_ISO).toBe("2026-08-28T18:00:00");
  });

  it("provides a label, name, address and https map link for every venue placeholder", () => {
    for (const venue of [CEREMONY_VENUE, RECEPTION_VENUE, GROOM_HOME, BRIDE_HOME]) {
      expect(venue.label.length).toBeGreaterThan(0);
      expect(venue.name.length).toBeGreaterThan(0);
      expect(venue.address.length).toBeGreaterThan(0);
      expect(venue.mapHref.startsWith("https://")).toBe(true);
    }
  });

  it("uses a placeholder Whish account number, not a real one", () => {
    expect(WHISH_ACCOUNT.number).toBe("00000000-00");
    expect(WHISH_ACCOUNT.label).toBe("ELIAS & VANESSA");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/weddingContent.test.ts`
Expected: FAIL — `Cannot find module './weddingContent'` (file doesn't exist yet).

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/weddingContent.ts`:

```ts
export const COUPLE = {
  groomFirstName: "Elias",
  groomFamily: "Bou Mrad Family",
  brideFirstName: "Vanessa",
  brideFamily: "Abboud Family",
} as const;

export const WEDDING_DATE_ISO = "2026-08-28T18:00:00";
export const WEDDING_DATE_DISPLAY = "28 August 2026";

export interface VenueDetail {
  label: string;
  name: string;
  address: string;
  /** Empty string when there's no specific time to show (e.g. a home address). */
  time: string;
  mapHref: string;
}

export const CEREMONY_VENUE: VenueDetail = {
  label: "Ceremony",
  name: "St. Elias Church", // placeholder — replace with the real church name
  address: "Placeholder Street, Placeholder Town", // placeholder — replace with the real address
  time: "At 6pm",
  mapHref: "https://maps.google.com/", // placeholder — replace with the real map link
};

export const RECEPTION_VENUE: VenueDetail = {
  label: "Reception",
  name: "The Grand Terrace", // placeholder — replace with the real venue name
  address: "Placeholder Avenue, Placeholder City", // placeholder — replace with the real address
  time: "At 8pm",
  mapHref: "https://maps.google.com/", // placeholder — replace with the real map link
};

export const GROOM_HOME: VenueDetail = {
  label: "Groom's Home",
  name: "Bou Mrad Residence", // placeholder — replace with the real house name/description
  address: "Placeholder Road, Placeholder Village", // placeholder — replace with the real address
  time: "",
  mapHref: "https://maps.google.com/", // placeholder — replace with the real map link
};

export const BRIDE_HOME: VenueDetail = {
  label: "Bride's Home",
  name: "Abboud Residence", // placeholder — replace with the real house name/description
  address: "Placeholder Road, Placeholder Village", // placeholder — replace with the real address
  time: "",
  mapHref: "https://maps.google.com/", // placeholder — replace with the real map link
};

export const WHISH_ACCOUNT = {
  number: "00000000-00", // placeholder — replace with the real Whish account number
  label: `${COUPLE.groomFirstName.toUpperCase()} & ${COUPLE.brideFirstName.toUpperCase()}`,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/weddingContent.test.ts`
Expected: PASS (4 tests).

---

### Task 2: Scratch-reveal pure logic

**Files:**
- Create: `src/lib/scratchReveal.ts`
- Test: `src/lib/scratchReveal.test.ts`

**Interfaces:**
- Produces: `SCRATCH_REVEAL_THRESHOLD: number` (0.55), `computeClearedRatio(alphaChannel: Uint8ClampedArray): number`, `isScratchRevealed(alphaChannel: Uint8ClampedArray, threshold?: number): boolean`. Consumed by `ScratchCard.tsx` (Task 3).

- [ ] **Step 1: Write the failing test**

Create `src/lib/scratchReveal.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { computeClearedRatio, isScratchRevealed } from "./scratchReveal";

function alphaArray(values: number[]): Uint8ClampedArray {
  return new Uint8ClampedArray(values);
}

describe("computeClearedRatio", () => {
  it("returns 0 for a fully opaque (unscratched) canvas", () => {
    expect(computeClearedRatio(alphaArray([255, 255, 255, 255]))).toBe(0);
  });

  it("returns 1 for a fully transparent (fully scratched) canvas", () => {
    expect(computeClearedRatio(alphaArray([0, 0, 0, 0]))).toBe(1);
  });

  it("returns 0.5 when exactly half the pixels are cleared", () => {
    expect(computeClearedRatio(alphaArray([0, 0, 255, 255]))).toBe(0.5);
  });

  it("returns 0 for an empty alpha channel", () => {
    expect(computeClearedRatio(alphaArray([]))).toBe(0);
  });
});

describe("isScratchRevealed", () => {
  it("is false below the reveal threshold", () => {
    const belowThreshold = alphaArray([0, 255, 255, 255]); // 25% cleared
    expect(isScratchRevealed(belowThreshold)).toBe(false);
  });

  it("is true at or above the reveal threshold", () => {
    const atThreshold = alphaArray([0, 0, 0, 255, 255]); // 60% cleared, threshold is 55%
    expect(computeClearedRatio(atThreshold)).toBeCloseTo(0.6);
    expect(isScratchRevealed(atThreshold)).toBe(true);
  });

  it("respects a custom threshold", () => {
    const thirtyPercentCleared = alphaArray([0, 0, 0, 255, 255, 255, 255, 255, 255, 255]);
    expect(isScratchRevealed(thirtyPercentCleared, 0.2)).toBe(true);
    expect(isScratchRevealed(thirtyPercentCleared, 0.5)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scratchReveal.test.ts`
Expected: FAIL — `Cannot find module './scratchReveal'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/scratchReveal.ts`:

```ts
export const SCRATCH_REVEAL_THRESHOLD = 0.55;
const TRANSPARENT_ALPHA_CUTOFF = 10;

/** Fraction (0-1) of the given alpha channel that is effectively transparent. */
export function computeClearedRatio(alphaChannel: Uint8ClampedArray): number {
  if (alphaChannel.length === 0) return 0;
  let clearedCount = 0;
  for (let i = 0; i < alphaChannel.length; i++) {
    if (alphaChannel[i] < TRANSPARENT_ALPHA_CUTOFF) clearedCount++;
  }
  return clearedCount / alphaChannel.length;
}

export function isScratchRevealed(
  alphaChannel: Uint8ClampedArray,
  threshold: number = SCRATCH_REVEAL_THRESHOLD
): boolean {
  return computeClearedRatio(alphaChannel) >= threshold;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scratchReveal.test.ts`
Expected: PASS (7 tests).

---

### Task 3: ScratchCard component

**Files:**
- Create: `src/components/ScratchCard.tsx`
- Test: `src/components/ScratchCard.test.tsx`

**Interfaces:**
- Consumes: `computeClearedRatio`, `isScratchRevealed` from `@/lib/scratchReveal` (Task 2).
- Produces: `ScratchCard` default export, props `{ overlayImageSrc: string; width?: number; height?: number; onReveal: () => void; className?: string }`. Consumed by `WeddingDetails.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `src/components/ScratchCard.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ScratchCard from "./ScratchCard";

class FakeCanvasContext {
  public clearedRatio = 0;
  drawImage = vi.fn();
  beginPath = vi.fn();
  arc = vi.fn();
  fill = vi.fn();
  globalCompositeOperation = "";
  getImageData(_x: number, _y: number, w: number, h: number) {
    const totalPixels = w * h;
    const clearedPixels = Math.round(totalPixels * this.clearedRatio);
    const data = new Uint8ClampedArray(totalPixels * 4);
    for (let p = 0; p < totalPixels; p++) {
      data[p * 4 + 3] = p < clearedPixels ? 0 : 255;
    }
    return { data } as unknown as ImageData;
  }
}

describe("ScratchCard", () => {
  let fakeCtx: FakeCanvasContext;

  beforeEach(() => {
    fakeCtx = new FakeCanvasContext();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      fakeCtx as unknown as CanvasRenderingContext2D
    );
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      left: 0, top: 0, width: 300, height: 170, right: 300, bottom: 170, x: 0, y: 0, toJSON: () => {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not call onReveal while under-scratched", () => {
    const onReveal = vi.fn();
    fakeCtx.clearedRatio = 0.1;
    const { container } = render(<ScratchCard overlayImageSrc="/heart.jpg" onReveal={onReveal} />);
    const canvas = container.querySelector("canvas")!;
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
    expect(onReveal).not.toHaveBeenCalled();
  });

  it("calls onReveal once the cleared ratio crosses the threshold", () => {
    const onReveal = vi.fn();
    fakeCtx.clearedRatio = 0.6;
    const { container } = render(<ScratchCard overlayImageSrc="/heart.jpg" onReveal={onReveal} />);
    const canvas = container.querySelector("canvas")!;
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("does not call onReveal a second time once already revealed", () => {
    const onReveal = vi.fn();
    fakeCtx.clearedRatio = 0.6;
    const { container } = render(<ScratchCard overlayImageSrc="/heart.jpg" onReveal={onReveal} />);
    const canvas = container.querySelector("canvas")!;
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(canvas, { clientX: 12, clientY: 12 });
    expect(onReveal).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ScratchCard.test.tsx`
Expected: FAIL — `Cannot find module './ScratchCard'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/ScratchCard.tsx`:

```tsx
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { isScratchRevealed } from "@/lib/scratchReveal";

interface ScratchCardProps {
  overlayImageSrc: string;
  width?: number;
  height?: number;
  onReveal: () => void;
  className?: string;
}

const BRUSH_RADIUS = 22;

const ScratchCard = ({
  overlayImageSrc,
  width = 300,
  height = 170,
  onReveal,
  className = "",
}: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPointerDownRef = useRef(false);
  const hasRevealedRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = overlayImageSrc;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, width, height);
    };

    return () => {
      image.onload = null;
    };
  }, [overlayImageSrc, width, height]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    if (hasRevealedRef.current) return;
    const alpha = ctx.getImageData(0, 0, width, height).data.filter((_, i) => i % 4 === 3);
    if (isScratchRevealed(alpha)) {
      hasRevealedRef.current = true;
      setIsRevealed(true);
      onReveal();
    }
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    scratchAt(e.clientX, e.clientY);
  };

  const stopScratching = () => {
    isPointerDownRef.current = false;
  };

  return (
    <div className={`relative inline-block ${className}`} style={{ width, height }}>
      <motion.canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 rounded-sm touch-none cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopScratching}
        onPointerLeave={stopScratching}
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: isRevealed ? "none" : "auto" }}
      />
    </div>
  );
};

export default ScratchCard;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ScratchCard.test.tsx`
Expected: PASS (3 tests).

---

### Task 4: InfoPanel component (venue/home detail box)

**Files:**
- Create: `src/components/InfoPanel.tsx`
- Test: `src/components/InfoPanel.test.tsx`

**Interfaces:**
- Consumes: `VenueDetail` type from `@/lib/weddingContent` (Task 1).
- Produces: `InfoPanel` default export, props `{ venue: VenueDetail }`. Consumed by `WeddingDetails.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `src/components/InfoPanel.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InfoPanel from "./InfoPanel";
import type { VenueDetail } from "@/lib/weddingContent";

const venue: VenueDetail = {
  label: "Ceremony",
  name: "St. Elias Church",
  address: "Placeholder Street, Placeholder Town",
  time: "At 6pm",
  mapHref: "https://maps.google.com/",
};

describe("InfoPanel", () => {
  it("renders the venue label, name, address and time", () => {
    render(<InfoPanel venue={venue} />);
    expect(screen.getByText("Ceremony")).toBeInTheDocument();
    expect(screen.getByText("St. Elias Church")).toBeInTheDocument();
    expect(screen.getByText("Placeholder Street, Placeholder Town")).toBeInTheDocument();
    expect(screen.getByText("At 6pm")).toBeInTheDocument();
  });

  it("links Get Directions to the venue's map href", () => {
    render(<InfoPanel venue={venue} />);
    const link = screen.getByRole("link", { name: /get directions/i });
    expect(link).toHaveAttribute("href", "https://maps.google.com/");
  });

  it("omits the time line when the venue has no time (e.g. a home address)", () => {
    render(<InfoPanel venue={{ ...venue, time: "" }} />);
    expect(screen.queryByText("At 6pm")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/InfoPanel.test.tsx`
Expected: FAIL — `Cannot find module './InfoPanel'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/InfoPanel.tsx`:

```tsx
import { MapPin } from "lucide-react";
import type { VenueDetail } from "@/lib/weddingContent";

interface InfoPanelProps {
  venue: VenueDetail;
}

const InfoPanel = ({ venue }: InfoPanelProps) => (
  <div
    className="w-full max-w-xs mx-auto px-8 py-8 text-center"
    style={{ border: "1px solid rgba(255,255,255,0.55)" }}
  >
    <p
      className="uppercase tracking-[0.32em] mb-3 text-white/70"
      style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
    >
      {venue.label}
    </p>
    <p
      className="text-white mb-2"
      style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.3rem,4vw,1.7rem)", letterSpacing: "0.03em" }}
    >
      {venue.name}
    </p>
    <p
      className="text-white/75 mb-2"
      style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "0.95rem" }}
    >
      {venue.address}
    </p>
    {venue.time && (
      <p
        className="text-white/90 mb-5 tracking-widest text-sm"
        style={{ fontFamily: "var(--font-amelia)", fontWeight: 300 }}
      >
        {venue.time}
      </p>
    )}
    <a
      href={venue.mapHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border rounded-sm px-5 py-2.5 mt-2 transition-all duration-300 border-white/60 text-white hover:bg-white hover:text-foreground"
      style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
    >
      <MapPin size={13} />
      Get Directions
    </a>
  </div>
);

export default InfoPanel;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/InfoPanel.test.tsx`
Expected: PASS (3 tests).

---

### Task 5: RevealSection primitive (full-bleed page + retriggering stagger animation)

**Files:**
- Create: `src/components/RevealSection.tsx`
- Test: `src/components/RevealSection.test.tsx`
- Modify: `src/test/setup.ts`

**Interfaces:**
- Produces: `RevealSection` default export, props `{ backgroundImage: string; overlay?: string; children: ReactNode; className?: string }`; named exports `RevealItem` (props `{ children: ReactNode; className?: string }`) and `revealItemVariants`. Consumed by `WeddingDetails.tsx` (Task 9).

- [ ] **Step 1: Add an IntersectionObserver mock to the test setup**

Framer Motion's `whileInView` (used by `RevealSection`) relies on `IntersectionObserver`, which jsdom doesn't implement. Modify `src/test/setup.ts` to add it, right after the existing `matchMedia` mock:

```ts
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

class IntersectionObserverMock {
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
  takeRecords = () => [];
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
```

- [ ] **Step 2: Write the failing test**

Create `src/components/RevealSection.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RevealSection, { RevealItem } from "./RevealSection";

describe("RevealSection", () => {
  it("renders its children inside a full-height section with the given background image", () => {
    const { container } = render(
      <RevealSection backgroundImage="/photo.jpg">
        <RevealItem>Hello</RevealItem>
      </RevealSection>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    const section = container.querySelector("section")!;
    expect(section.style.backgroundImage).toContain("/photo.jpg");
    expect(section.style.height).toBe("100dvh");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/RevealSection.test.tsx`
Expected: FAIL — `Cannot find module './RevealSection'`.

- [ ] **Step 4: Write minimal implementation**

Create `src/components/RevealSection.tsx`:

```tsx
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealSectionProps {
  backgroundImage: string;
  overlay?: string;
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

export const revealItemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

export const RevealItem = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div variants={revealItemVariants} className={className}>
    {children}
  </motion.div>
);

const RevealSection = ({
  backgroundImage,
  overlay = "rgba(0,0,0,0.42)",
  children,
  className = "",
}: RevealSectionProps) => (
  <section
    className={`snap-start snap-always relative flex items-center justify-center overflow-hidden ${className}`}
    style={{
      height: "100dvh",
      backgroundImage: `url('${backgroundImage}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0" style={{ background: overlay }} />
    <motion.div
      className="relative z-10 w-full px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  </section>
);

export default RevealSection;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/RevealSection.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 6: Run the full test suite to confirm the setup change didn't break anything else**

Run: `npx vitest run`
Expected: All existing tests still PASS.

---

### Task 6: GiftRegistry — light variant + placeholder Whish account

**Files:**
- Modify: `src/components/GiftRegistry.tsx`
- Create: `src/components/GiftRegistry.test.tsx`

**Interfaces:**
- Consumes: `WHISH_ACCOUNT` from `@/lib/weddingContent` (Task 1).
- Produces: `GiftRegistry` default export now accepts optional `variant?: "light" | "dark"` (default `"dark"`). Consumed by `WeddingDetails.tsx` (Task 9) with `variant="light"`.

- [ ] **Step 1: Write the failing test**

Create `src/components/GiftRegistry.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GiftRegistry from "./GiftRegistry";
import { WHISH_ACCOUNT } from "@/lib/weddingContent";

describe("GiftRegistry", () => {
  it("shows the placeholder Whish account number and label from weddingContent", () => {
    render(<GiftRegistry />);
    expect(screen.getByText(WHISH_ACCOUNT.number)).toBeInTheDocument();
    expect(screen.getByText(WHISH_ACCOUNT.label)).toBeInTheDocument();
  });

  it("copies the account number to the clipboard when the copy button is clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<GiftRegistry />);
    fireEvent.click(screen.getByTitle("Copy account number"));

    expect(writeText).toHaveBeenCalledWith(WHISH_ACCOUNT.number);
    expect(await screen.findByText("Copied to clipboard ✓")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/GiftRegistry.test.tsx`
Expected: FAIL — the current file hardcodes `"30551033-03"` / `"IBRAHIM & MARIANNE"`, not `WHISH_ACCOUNT.number` / `WHISH_ACCOUNT.label`.

- [ ] **Step 3: Write the implementation**

Replace the contents of `src/components/GiftRegistry.tsx`:

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { WHISH_ACCOUNT } from "@/lib/weddingContent";

interface GiftRegistryProps {
  variant?: "light" | "dark";
}

const GiftRegistry = ({ variant = "dark" }: GiftRegistryProps) => {
  const [copied, setCopied] = useState(false);
  const isLight = variant === "light";

  const copyAccount = () => {
    navigator.clipboard.writeText(WHISH_ACCOUNT.number).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const bodyTextColor = isLight ? "rgba(255,255,255,0.85)" : "#1C2632";
  const labelColor = isLight ? "rgba(255,255,255,0.7)" : "hsl(var(--dusty-blue-dark))";
  const iconColor = isLight ? "#FFFFFF" : "#1C2632";

  return (
    <motion.div
      className="text-center max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p
        className={isLight ? "text-white" : "text-foreground"}
        style={{ fontFamily: "var(--font-script)", fontSize: "clamp(2.2rem,7vw,2.8rem)", marginBottom: "0.5rem" }}
      >
        Thank You
      </p>
      <p
        className="tracking-[0.32em] uppercase mb-6"
        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: labelColor }}
      >
        Dear Family and Friends
      </p>

      <div className="flex justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        className="tracking-[0.3em] uppercase mb-3"
        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: labelColor }}
      >
        Wedding Gift
      </p>

      <p
        className="leading-relaxed mb-10"
        style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.2rem", color: bodyTextColor }}
      >
        The joy of sharing this day with you is the greatest gift we could receive.
        <br />
        For those wishing to celebrate us with a gift, a Whish money account is available.
      </p>

      <div
        className="inline-flex items-center gap-6 rounded-sm px-8 py-6 shadow-sm"
        style={{ background: isLight ? "rgba(255,255,255,0.94)" : "white", border: "1px solid hsl(var(--dusty-blue-pale))" }}
      >
        <div className="text-left">
          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "hsl(var(--dusty-blue))",
              marginBottom: "4px",
            }}
          >
            Account Number
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "1.9rem",
              letterSpacing: "0.05em",
              color: "#1C2632",
              fontWeight: 500,
            }}
          >
            {WHISH_ACCOUNT.number}
          </p>
          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "hsl(var(--dusty-blue-dark))",
              marginTop: "4px",
            }}
          >
            {WHISH_ACCOUNT.label}
          </p>
        </div>

        <button
          onClick={copyAccount}
          className="transition-all p-2 rounded-full hover:bg-slate-50"
          style={{ color: "#1C2632" }}
          title="Copy account number"
        >
          {copied ? (
            <Check className="w-6 h-6" style={{ color: "green" }} />
          ) : (
            <Copy className="w-6 h-6 opacity-60 hover:opacity-100" />
          )}
        </button>
      </div>

      {copied && (
        <motion.p
          className="mt-4"
          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "green", letterSpacing: "0.1em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Copied to clipboard ✓
        </motion.p>
      )}
    </motion.div>
  );
};

export default GiftRegistry;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/GiftRegistry.test.tsx`
Expected: PASS (2 tests).

---

### Task 7: RSVPForm — light variant

**Files:**
- Modify: `src/components/RSVPForm.tsx`
- Create: `src/components/RSVPForm.test.tsx`

**Interfaces:**
- Produces: `RSVPForm` default export now accepts optional `variant?: "light" | "dark"` (default `"dark"`). `GOOGLE_SCRIPT_URL`, the `?names=` parsing, and the POST payload shape are all unchanged. Consumed by `WeddingDetails.tsx` (Task 9) with `variant="light"`.

- [ ] **Step 1: Write the failing test**

Create `src/components/RSVPForm.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RSVPForm from "./RSVPForm";

function setSearch(search: string) {
  window.history.pushState({}, "", `/?${search}`);
}

describe("RSVPForm", () => {
  beforeEach(() => {
    setSearch("");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders nothing when the URL has no ?names= param", () => {
    const { container } = render(<RSVPForm />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists each invited name as a toggleable guest chip", () => {
    setSearch("names=Alice,Bob");
    render(<RSVPForm />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("submits the selected attendees to the Google Sheets endpoint", async () => {
    setSearch("names=Alice,Bob");
    const fetchMock = vi.fn().mockResolvedValue({});
    vi.stubGlobal("fetch", fetchMock);

    render(<RSVPForm />);
    fireEvent.click(screen.getByText("Accepts"));
    fireEvent.click(screen.getByRole("button", { name: /confirm rsvp/i }));

    await screen.findByText(/celebrate with you/i);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("script.google.com"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("accepts a variant prop without changing the guest data flow", () => {
    setSearch("names=Alice");
    render(<RSVPForm variant="light" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/RSVPForm.test.tsx`
Expected: FAIL — `variant` prop doesn't exist yet on the current component (TypeScript error on the last test) and/or the "Accepts" flow test may already pass; the `variant` test is the one that fails.

- [ ] **Step 3: Write the implementation**

Replace the contents of `src/components/RSVPForm.tsx`:

```tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5JtiSLlCth_McxFSoy7FLPxY4VIDoHpMFJKix_wADo9ugx4PnTXE_ws-iWv8Xu1Isbw/exec";

interface RSVPFormProps {
  variant?: "light" | "dark";
}

const RSVPForm = ({ variant = "dark" }: RSVPFormProps) => {
  const [invitedNames, setInvitedNames] = useState<string[]>([]);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<"yes" | "no" | "">("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const isLight = variant === "light";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const namesParam = params.get("names");
    if (namesParam) {
      const namesArray = namesParam.split(",").map((n) => n.trim());
      setInvitedNames(namesArray);
      setSelectedAttendees(namesArray);
    }
  }, []);

  const toggleName = (name: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance || selectedAttendees.length === 0) return;
    setStatus("submitting");

    const payload = new URLSearchParams({
      name: invitedNames.join(", "),
      attendees: selectedAttendees.join(", "),
      attendance: attendance === "yes" ? "Attending" : "Declined",
      message,
      date: new Date().toLocaleString("en-GB"),
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (invitedNames.length === 0) return null;

  const headingColor = isLight ? "text-white" : "text-foreground";
  const labelColor = isLight ? "text-white/70" : "text-dusty-blue";
  const mutedColor = isLight ? "text-white/70" : "text-muted-foreground";
  const chipBorder = isLight ? "border-white/50" : "border-dusty-blue-pale";
  const chipInactiveText = isLight ? "text-white/50" : "text-muted-foreground";
  const chipActiveBg = isLight
    ? "bg-white text-foreground border-white"
    : "bg-foreground text-white border-foreground";

  return (
    <motion.div
      className="text-center py-20 px-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <p className={`${labelColor} tracking-[0.3em] uppercase mb-2 text-[0.62rem] font-montserrat`}>
        Be Our Guest
      </p>
      <h2 className={`${headingColor} mb-1 font-serif text-[clamp(2rem,6vw,2.8rem)] font-light tracking-wider`}>
        RSVP
      </h2>
      <p className={`${mutedColor} italic mb-8 font-serif`}>
        Kindly respond before August 1st, 2026.
      </p>

      {status === "success" ? (
        <motion.div className="flex flex-col items-center gap-4 py-10" initial={{ scale: 0.9 }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-dusty-blue">
            <Check className="w-7 h-7 text-white" />
          </div>
          <p className={`font-serif italic text-lg ${isLight ? "text-white" : ""}`}>
            {attendance === "yes" ? "We can't wait to celebrate with you!" : "Thank you for letting us know."}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="text-left space-y-8">
          <div>
            <label className={`block ${mutedColor} tracking-widest uppercase mb-4 text-[0.6rem] font-montserrat`}>
              Guests
            </label>
            <div className="flex flex-wrap gap-2">
              {invitedNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleName(name)}
                  className={`px-4 py-2 border rounded-full transition-all text-xs font-montserrat tracking-tight ${
                    selectedAttendees.includes(name)
                      ? chipActiveBg
                      : `${chipBorder} ${chipInactiveText} opacity-40`
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className={`mt-3 text-[0.6rem] ${mutedColor} italic leading-relaxed`}>
              {attendance === "no"
                ? "* Select the names of those who are declining."
                : "* Select the names of those who will be attending."}
            </p>
          </div>

          <div className="flex gap-3">
            {(["yes", "no"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAttendance(val)}
                className={`flex-1 py-4 border rounded-sm transition-all text-[0.65rem] tracking-widest uppercase font-montserrat ${
                  attendance === val ? "bg-dusty-blue border-dusty-blue text-white" : `${chipBorder} ${mutedColor}`
                }`}
              >
                {val === "yes" ? "Accepts" : "Declines"}
              </button>
            ))}
          </div>

          <div>
            <label className={`block ${mutedColor} tracking-widest uppercase mb-2 text-[0.6rem] font-montserrat`}>
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full px-4 py-3 border ${chipBorder} rounded-sm bg-transparent focus:outline-none focus:border-dusty-blue ${
                isLight ? "text-white placeholder:text-white/50" : ""
              }`}
              placeholder="Leave a note..."
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || !attendance || (attendance === "yes" && selectedAttendees.length === 0)}
            className={`w-full py-4 uppercase tracking-[0.2em] text-[0.7rem] transition-colors disabled:opacity-30 ${
              isLight
                ? "bg-white text-foreground hover:bg-dusty-blue hover:text-white"
                : "bg-foreground text-white hover:bg-dusty-blue"
            }`}
          >
            {status === "submitting" ? "Sending..." : "Confirm RSVP"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default RSVPForm;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/RSVPForm.test.tsx`
Expected: PASS (4 tests).

---

### Task 8: CoverPage (replaces the illustrated-envelope cover)

**Files:**
- Create: `src/components/CoverPage.tsx`
- Create: `src/components/CoverPage.test.tsx`
- Delete: `src/components/EnvelopeCard.tsx`
- Modify: `src/pages/Index.tsx`

**Interfaces:**
- Produces: `CoverPage` default export, props `{ onOpen: () => void; onInteraction: () => void }` — identical prop signature to the old `EnvelopeCard`, so `Index.tsx` only needs an import/JSX rename.

- [ ] **Step 1: Write the failing test**

Create `src/components/CoverPage.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CoverPage from "./CoverPage";

describe("CoverPage", () => {
  it("calls onInteraction immediately and onOpen 500ms after the button is clicked", () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const onInteraction = vi.fn();
    render(<CoverPage onOpen={onOpen} onInteraction={onInteraction} />);

    fireEvent.click(screen.getByRole("button", { name: /open the invitation/i }));
    expect(onInteraction).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(onOpen).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("does not trigger onOpen twice on repeated clicks", () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const onInteraction = vi.fn();
    render(<CoverPage onOpen={onOpen} onInteraction={onInteraction} />);

    const button = screen.getByRole("button", { name: /open the invitation/i });
    fireEvent.click(button);
    fireEvent.click(button);
    vi.advanceTimersByTime(500);

    expect(onInteraction).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/CoverPage.test.tsx`
Expected: FAIL — `Cannot find module './CoverPage'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/CoverPage.tsx`:

```tsx
import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coverPhoto from "@/assets/wedding-couple-1.jpg"; // placeholder — replace with the real cover photo

interface CoverPageProps {
  onOpen: () => void;
  onInteraction: () => void;
}

const CoverPage = ({ onOpen, onInteraction }: CoverPageProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleOpen = () => {
    if (isDismissed) return;
    onInteraction();
    setIsDismissed(true);
    setTimeout(onOpen, 500);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-[#667582]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${coverPhoto})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.5) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-6">
            <motion.button
              type="button"
              onClick={handleOpen}
              onKeyDown={handleKeyDown}
              aria-label="Open the invitation"
              className="text-white border border-white/70 rounded-full px-8 py-3 uppercase tracking-[0.3em] text-[0.68rem] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              whileTap={{ scale: 0.95 }}
            >
              Open the Invitation
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoverPage;
```

Delete the old file: `rm src/components/EnvelopeCard.tsx`

Modify `src/pages/Index.tsx` — change the import and JSX tag (everything else stays the same):

```tsx
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoverPage from "@/components/CoverPage";
import WeddingDetails from "@/components/WeddingDetails";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const musicStartRef = useRef<(() => void) | null>(null);

  const handleInteraction = () => {
    musicStartRef.current?.();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <MusicPlayer startRef={musicStartRef} />
      <AnimatePresence>
        {!isOpen && <CoverPage onOpen={handleOpen} onInteraction={handleInteraction} />}
      </AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <WeddingDetails />
        </motion.div>
      )}
    </>
  );
};

export default Index;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/CoverPage.test.tsx`
Expected: PASS (2 tests).

---

### Task 9: Rewrite WeddingDetails.tsx as the 6-page scroll-snap experience

**Files:**
- Modify: `src/components/WeddingDetails.tsx` (full rewrite)
- Create: `src/components/WeddingDetails.test.tsx`
- Delete: `src/components/PhotoGallery.tsx`

**Interfaces:**
- Consumes: `RevealSection`/`RevealItem` (Task 5), `InfoPanel` (Task 4), `ScratchCard` (Task 3), `CountdownTimer` (existing, unchanged — props `{ targetDate: string; variant?: "dark" | "light" }`), `GiftRegistry` (Task 6, prop `variant`), `RSVPForm` (Task 7, prop `variant`), and all named exports from `@/lib/weddingContent` (Task 1).
- Produces: `WeddingDetails` default export, no props (same as before) — consumed unchanged by `src/pages/Index.tsx`.

- [ ] **Step 1: Write the failing test**

Create `src/components/WeddingDetails.test.tsx`. It mocks `ScratchCard` so the test can trigger `onReveal` directly, without needing a real canvas:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WeddingDetails from "./WeddingDetails";

vi.mock("./ScratchCard", () => ({
  default: ({ onReveal }: { onReveal: () => void }) => (
    <button type="button" onClick={onReveal}>
      fake-scratch-card
    </button>
  ),
}));

describe("WeddingDetails", () => {
  it("hides the wedding date and countdown until the scratch card is revealed", () => {
    render(<WeddingDetails />);
    expect(screen.queryByText("28 August 2026")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("fake-scratch-card"));

    expect(screen.getByText("28 August 2026")).toBeInTheDocument();
  });

  it("renders the groom and bride family names together", () => {
    render(<WeddingDetails />);
    expect(screen.getByText("Bou Mrad Family")).toBeInTheDocument();
    expect(screen.getByText("Abboud Family")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/WeddingDetails.test.tsx`
Expected: FAIL — the current `WeddingDetails.tsx` doesn't render "Bou Mrad Family"/"Abboud Family"/"28 August 2026", and doesn't use `ScratchCard` at all yet.

- [ ] **Step 3: Write the implementation**

Delete the old gallery file, it's no longer used anywhere: `rm src/components/PhotoGallery.tsx`

Replace the contents of `src/components/WeddingDetails.tsx`:

```tsx
import { useState } from "react";
import RevealSection, { RevealItem } from "./RevealSection";
import InfoPanel from "./InfoPanel";
import ScratchCard from "./ScratchCard";
import CountdownTimer from "./CountdownTimer";
import GiftRegistry from "./GiftRegistry";
import RSVPForm from "./RSVPForm";
import {
  COUPLE,
  WEDDING_DATE_ISO,
  WEDDING_DATE_DISPLAY,
  CEREMONY_VENUE,
  RECEPTION_VENUE,
  GROOM_HOME,
  BRIDE_HOME,
} from "@/lib/weddingContent";

/*
 * ─── BACKGROUND PHOTOS ────────────────────────────────────────────────────
 * Every page below has one full-bleed background photo. Replace the files
 * in src/assets/ (or swap these imports) with the couple's real photos —
 * each import below is labeled with which page it belongs to.
 */
import pageWeLoveBg   from "@/assets/wedding-couple-2.jpg"; // page: "We love because..."
import pageVerseBg    from "@/assets/IMG_2741.webp";        // page: verse end + families + scratch date
import pageVenueBg    from "@/assets/IMG_2745.webp";        // page: church + venue
import pageHomesBg    from "@/assets/IMG_2000.webp";        // page: groom's home + bride's home
import pageWishBg     from "@/assets/wedding-couple-3.jpg"; // page: wish account
import pageRsvpBg     from "@/assets/IMG_2750.webp";        // page: RSVP
import scratchTexture from "@/assets/sacred-heart.jpeg";    // scratch-card overlay art
/* ────────────────────────────────────────────────────────────────────────── */

const WeddingDetails = () => {
  const [isDateRevealed, setIsDateRevealed] = useState(false);

  return (
    <div className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory">
      {/* ── 1. "We love because..." ── */}
      <RevealSection backgroundImage={pageWeLoveBg}>
        <RevealItem>
          <p
            className="text-white leading-relaxed"
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: "italic",
              fontSize: "clamp(1.8rem,6vw,3rem)",
              textShadow: "0 2px 16px rgba(0,0,0,0.45)",
            }}
          >
            We love because…
          </p>
        </RevealItem>
      </RevealSection>

      {/* ── 2. Verse end + families + names + scratch date reveal ── */}
      <RevealSection backgroundImage={pageVerseBg} overlay="rgba(18,31,48,0.55)">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <RevealItem>
            <p
              className="text-white leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
                fontSize: "clamp(1.4rem,5vw,2.2rem)",
                textShadow: "0 2px 16px rgba(0,0,0,0.45)",
              }}
            >
              …he loved us first
            </p>
          </RevealItem>

          <RevealItem>
            <p
              className="text-white/80 uppercase tracking-[0.3em]"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem" }}
            >
              Together with their families
            </p>
          </RevealItem>

          <RevealItem>
            <div
              className="flex items-center justify-center gap-10 text-white uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.95rem" }}
            >
              <span>{COUPLE.groomFamily}</span>
              <span className="opacity-50">&amp;</span>
              <span>{COUPLE.brideFamily}</span>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="text-white" style={{ fontFamily: "var(--font-script)", fontSize: "clamp(2.4rem,8vw,3.2rem)" }}>
              {COUPLE.groomFirstName} &amp; {COUPLE.brideFirstName}
            </p>
          </RevealItem>

          <RevealItem>
            <div className="flex flex-col items-center gap-3">
              <p
                className="text-white/70 uppercase tracking-[0.28em] animate-pulse-soft"
                style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
              >
                Scratch to reveal your wedding date
              </p>
              <ScratchCard overlayImageSrc={scratchTexture} onReveal={() => setIsDateRevealed(true)} />
            </div>
          </RevealItem>

          {isDateRevealed && (
            <RevealItem>
              <div className="flex flex-col items-center gap-6">
                <p
                  className="text-white"
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(2rem,6vw,3rem)" }}
                >
                  {WEDDING_DATE_DISPLAY}
                </p>
                <CountdownTimer targetDate={WEDDING_DATE_ISO} variant="light" />
              </div>
            </RevealItem>
          )}
        </div>
      </RevealSection>

      {/* ── 3. Church + Venue ── */}
      <RevealSection backgroundImage={pageVenueBg}>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
          <RevealItem>
            <h2
              className="text-white"
              style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.8rem,6vw,2.6rem)", letterSpacing: "0.04em" }}
            >
              The Celebration
            </h2>
          </RevealItem>
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center w-full">
            <RevealItem>
              <InfoPanel venue={CEREMONY_VENUE} />
            </RevealItem>
            <RevealItem>
              <InfoPanel venue={RECEPTION_VENUE} />
            </RevealItem>
          </div>
        </div>
      </RevealSection>

      {/* ── 4. Groom's Home + Bride's Home ── */}
      <RevealSection backgroundImage={pageHomesBg}>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
          <RevealItem>
            <h2
              className="text-white"
              style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.8rem,6vw,2.6rem)", letterSpacing: "0.04em" }}
            >
              Before The Big Day
            </h2>
          </RevealItem>
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center w-full">
            <RevealItem>
              <InfoPanel venue={GROOM_HOME} />
            </RevealItem>
            <RevealItem>
              <InfoPanel venue={BRIDE_HOME} />
            </RevealItem>
          </div>
        </div>
      </RevealSection>

      {/* ── 5. Wish Account ── */}
      <RevealSection backgroundImage={pageWishBg}>
        <RevealItem>
          <GiftRegistry variant="light" />
        </RevealItem>
      </RevealSection>

      {/* ── 6. RSVP ── */}
      <RevealSection backgroundImage={pageRsvpBg}>
        <RevealItem>
          <RSVPForm variant="light" />
        </RevealItem>
      </RevealSection>
    </div>
  );
};

export default WeddingDetails;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/WeddingDetails.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: All tests across the project PASS.

---

### Task 10: Update the site route to the new couple's names

**Files:**
- Modify: `src/App.tsx:19`

**Interfaces:** none (routing only).

- [ ] **Step 1: Update the route path**

In `src/App.tsx`, change:

```tsx
          <Route path="/Ibrahim-and-Marianne" element={<Index />} />
```

to:

```tsx
          <Route path="/Elias-and-Vanessa" element={<Index />} />
```

- [ ] **Step 2: Confirm the project still builds**

Run: `npm run build`
Expected: Build completes with no TypeScript or bundling errors.

---

### Task 11: Manual verification in the browser

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Open the site and walk through the full flow**

Open `http://localhost:5173/Elias-and-Vanessa?names=Guest%20One,Guest%20Two` (adjust the port if Vite picks a different one) and confirm, in order:

1. Cover page shows a full-bleed photo and an "Open the Invitation" button; clicking it starts the music and transitions in.
2. Scrolling/swiping down moves cleanly, one full screen at a time (scroll-snap), through: "We love because…" → verse end + families ("Bou Mrad Family" / "Abboud Family") + "Elias & Vanessa" script names → the scratch card.
3. On the scratch-card page, the date and countdown are **not** visible at first. Click-dragging across the canvas gradually reveals the Sacred Heart texture erasing away; once enough is cleared, "28 August 2026" and the countdown fade in underneath. Scrolling past without scratching never shows the date anywhere.
4. Continuing to scroll: church + venue panels, then groom's/bride's home panels, then the Wish Account page (placeholder account number, copy-to-clipboard works), then the final RSVP page — guest chips for "Guest One"/"Guest Two" toggle, Accept/Decline works, and submitting posts to the Google Sheet (check the network tab for the POST to `script.google.com`, or check the linked spreadsheet).
5. Each page's text elements pop/fade in when the page is scrolled into view, and re-play the same animation if you scroll back up to a previous page.
6. The floating music-player button in the bottom-right still works.

- [ ] **Step 3: Fix anything that doesn't match, then re-run the full test suite**

Run: `npx vitest run`
Expected: All tests PASS.

Per the Global Constraints above, do not commit any of this work — leave it in the working tree for the user to review.
