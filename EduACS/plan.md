I want to implement a scroll-driven section transition animation inspired by the StringTune website (string-tune.fiddle.digital). Here is a precise, detailed description of every aspect of the effect:

---

## TECH STACK

- React.js with functional components and hooks (useEffect, useRef, useState).
- NO Tailwind CSS. Use inline styles (JS style objects) or CSS Modules only.
- No external animation libraries (no GSAP, no ScrollTrigger, no Framer Motion).
- Deliver a ScrollTransition.jsx component (self-contained, default export) and a minimal App.jsx.
- Use requestAnimationFrame + scroll event for the animation loop.
- Works in all modern browsers. Smooth on desktop and mobile.

---

## COLOR INSTRUCTION (IMPORTANT)

Do NOT use arbitrary placeholder colors like #e8e2df or #0f0f0f.

Before writing any color value, first identify the project's brand palette:
- If a style guide, Figma file, or existing CSS is provided, use those exact values.
- If no palette is provided, ASK the user for their primary brand color before proceeding.
- Derive the full palette from the brand color: a light section background, a dark section background, heading text, body text, and any accent colors.

All colors in the component must be intentional, named as JS constants at the top of the file, and documented with a comment explaining their role.

---

## WHAT THE ANIMATION IS

As the user scrolls down, a large solid-colored shape (matching the background of the NEXT section) rises up from the bottom of the viewport, gradually consuming and replacing the current section. The shape has a convex dome/hill curve on its top edge — it bulges UPWARD in the center, like a rising sun or a hill — NOT concave like an arch or bowl.

---

## PAGE STRUCTURE

Build two full-height sections:

SECTION 1 (light):
- Background: [BRAND_LIGHT — e.g. warm off-white derived from brand]
- Large display text, e.g. "Flexibility" centered, font-size ~10vw, font-weight 700
- A subtitle line below in uppercase tracking
- Four feature columns at the bottom with number labels (1)(2)(3)(4) and short paragraphs

SECTION 2 (dark):
- Background: [BRAND_DARK — e.g. near-black or deep brand hue]
- Light-colored text on dark background
- Some content visible after the transition fully completes

---

## THE TRANSITION MECHANISM

Use a "sticky scroll zone" technique:

1. A tall wrapper div (height: 300vh) enables slow scroll-through.
2. Inside it, a position:sticky; top:0; height:100vh child stays fixed during scroll.
3. Inside the sticky frame, the dark section (section 2) sits at the bottom of the z-stack.
4. On top, an SVG acts as a "curtain" that starts covering the entire viewport and progressively reveals the dark section below as the user scrolls.

---

## THE SVG DOME SHAPE

SVG viewBox: "0 0 1440 900", preserveAspectRatio="none", width/height 100%.

PHASE 1 (progress = 0): Shape covers entire viewport. Bottom edge below visible area (y≈1100). Looks like a solid flat rectangle.

PHASE 2 (progress 0→0.7): Shape rises. Center rises faster than sides, creating a convex hill. Path:
  M0,0 L1440,0 L1440,{sideY} Q720,{peakY} 0,{sideY} Z
  where peakY < sideY.

PHASE 3 (progress 0.7→1.0): Entire shape exits off the top of the viewport.

Fill of SVG path = Section 1 background color (brand light).

---

## SCROLL CALCULATION (place in useEffect)

const getProgress = () => {
  const rect = zoneRef.current.getBoundingClientRect();
  const scrollable = zoneRef.current.offsetHeight - window.innerHeight;
  const raw = -rect.top / scrollable;
  return Math.max(0, Math.min(1, raw));
};

const easeInOutCubic = (t) =>
  t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;

Use requestAnimationFrame for the animation loop. Clean up both the scroll listener and the RAF handle in the useEffect return.

---

## DOME PATH MATH

const p = easeInOutCubic(rawProgress);
const sideY = lerp(1100, -200, p);          // sides rise from below to above screen
const domeBulge = Math.sin(p * Math.PI) * 280; // bell-curve depth, 0 at start and end
const peakY = sideY - domeBulge;             // center is always higher than sides
const d = `M0,0 L1440,0 L1440,${sideY} Q720,${peakY} 0,${sideY} Z`;

---

## VISUAL DETAILS

- SVG curtain: z-index above dark section, pointer-events: none.
- No box shadows, no gradients, no blur. Clean flat color only.
- Section 1 content sits inside the sticky frame so it naturally scrolls away with the curtain.
- Include comments in the JS explaining each calculation step.

---

## WHAT NOT TO DO

- Do NOT use clip-path on the section. Shape must be an SVG path element.
- Do NOT use CSS scroll-driven animations.
- Do NOT make the dome concave. The curve must bulge UPWARD (convex hill).
- Do NOT snap or jump — animation must feel physically continuous.
- Do NOT hardcode arbitrary colors. All colors from the brand palette only.