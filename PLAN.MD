I want to implement a scroll-driven section transition animation inspired 
by the StringTune website (string-tune.fiddle.digital). Here is a precise, 
detailed description of every aspect of the effect:

---

## WHAT THE ANIMATION IS

As the user scrolls down, a large solid-colored shape (matching the 
background of the NEXT section) rises up from the bottom of the viewport, 
gradually consuming and replacing the current section. The shape has a 
convex dome/hill curve on its top edge — it bulges UPWARD in the center, 
like a rising sun or a hill — NOT concave like an arch or bowl.

This is called a "Scroll-driven Convex Dome Reveal" or 
"Organic Section Transition."

---

## PAGE STRUCTURE

Build two full-height sections:

SECTION 1 (light):
- Background: #e8e2df (warm off-white / light pinkish-grey)
- Large display text, e.g. "Flexibility" centered, font-size ~10vw, 
  font-weight 700, color #111
- A subtitle line below in uppercase tracking, e.g. "Code With Clarity"
- Four feature columns at the bottom of the section, each with a number 
  label like (1) (2) (3) (4) and a short paragraph below

SECTION 2 (dark):
- Background: #0f0f0f (near black)
- Some content visible after the transition fully completes
- Light-colored text on dark background

---

## THE TRANSITION MECHANISM

Use a "sticky scroll zone" technique:

1. Wrap the transition in a tall container div 
   (height: 300vh or 250vh) so scrolling through it 
   takes a long time.

2. Inside it, place a `position: sticky; top: 0; height: 100vh` 
   child that stays fixed to the viewport during scroll.

3. Inside the sticky frame, the DARK section (section 2) sits 
   at the bottom of the z-stack, fully visible.

4. On top of it, an SVG element acts as a "curtain" that starts 
   covering the entire viewport (hiding the dark section beneath), 
   and progressively reveals the dark section as the user scrolls.

---

## THE SVG DOME SHAPE — EXACT BEHAVIOR

The SVG viewBox should be "0 0 1440 900" with 
preserveAspectRatio="none" and width/height 100%.

The curtain SVG path covers the entire rectangle PLUS has a 
convex dome bump at the bottom edge:

PHASE 1 — Start (scroll progress = 0):
The shape covers the ENTIRE viewport. The bottom edge is 
at or BELOW the visible area (e.g., y=1100 in a 900-tall viewBox). 
No dome is visible — it looks like a solid flat rectangle 
covering everything. The dark section beneath is NOT visible.

PHASE 2 — Dome rises (progress 0 → 0.7):
The shape starts pulling upward. The bottom edge rises. 
But the CENTER of the bottom edge rises FASTER than the sides, 
creating a convex dome/hill shape. The SVG path looks like:
  M0,0 L1440,0 L1440,[bottomEdge] 
  Q720,[domeTopY] 0,[bottomEdge] Z

Where domeTopY < bottomEdge (the center peak is higher than 
the side corners). The difference between domeTopY and bottomEdge 
controls the "depth" of the dome curve — aim for the peak to be 
about 15–25% of viewport height above the side corners at maximum 
dome depth.

The dome depth itself should animate: it starts flat (0 depth), 
grows to maximum dome depth around mid-progress, then flattens 
again as it exits off-screen.

PHASE 3 — Exit (progress 0.7 → 1.0):
The entire shape (dome and all) exits off the TOP of the 
viewport, fully revealing the dark section. The path's Y 
values all go negative (off screen).

---

## SCROLL CALCULATION

  const zone = document.getElementById('transitionZone');
  
  function getProgress() {
    const rect = zone.getBoundingClientRect();
    const scrollable = zone.offsetHeight - window.innerHeight;
    const raw = -rect.top / scrollable;
    return Math.max(0, Math.min(1, raw));
  }

Apply an ease-in-out-cubic easing to smooth the motion:
  function easeInOutCubic(t) {
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
  }

Use requestAnimationFrame for the scroll listener — not 
direct scroll event mutation — for 60fps performance.

---

## DOME PATH MATH (exact values to aim for)

ViewBox: 1440 wide × 900 tall.
Let `p` = eased scroll progress (0 to 1).

// Side bottom corners Y position: start below screen, rise to off-top
const sideY = lerp(1100, -200, p);

// Dome peak Y: the center rises ahead of the sides creating the hill
// Peak offset below sideY: creates the visual depth of the dome
// Use a bell-curve multiplier so depth is 0 at start, max at mid, 0 at end
const domeBulge = Math.sin(p * Math.PI) * 280;
const peakY = sideY - domeBulge;

// SVG path
const d = `M0,0 L1440,0 L1440,${sideY} Q720,${peakY} 0,${sideY} Z`;
path.setAttribute('d', d);

The fill of this SVG path should match Section 1's background: #e8e2df

---

## VISUAL DETAILS

- The SVG curtain should have z-index above the dark section, 
  but the SVG itself has pointer-events: none so users can 
  interact with the dark section once revealed.
  
- NO box shadows, NO gradients, NO blur. Clean flat color only.

- The content of Section 1 (title, columns) should appear to 
  "stay in place" visually as the dome lifts away beneath them. 
  Achieve this by placing Section 1's content as a separate 
  fixed or sticky element layered OVER the SVG curtain — or 
  alternatively, embed it inside the SVG curtain div so it 
  scrolls away with the curtain. The StringTune site embeds 
  the light section content inside the sticky frame and the 
  content naturally moves upward as the curtain rises.

---

## TECH STACK

- Vanilla HTML, CSS, and JavaScript only. No frameworks, 
  no animation libraries (no GSAP, no ScrollTrigger, 
  no Framer Motion).
- Single self-contained HTML file.
- Works in all modern browsers.
- Smooth on both desktop and mobile.
- Use requestAnimationFrame + scroll event for the animation loop.

---

## WHAT NOT TO DO

- Do NOT use clip-path on the section itself. The shape must 
  be an SVG path element for the dome curvature to work.
- Do NOT use CSS scroll-driven animations (they lack the 
  cross-browser support needed).
- Do NOT make the dome concave (arch/bowl shape). The curve 
  must bulge UPWARD in the center (convex dome, hill shape).
- Do NOT snap or jump — the entire animation should feel 
  physically smooth and continuous.

---

## DELIVERABLE

A single index.html file with the complete, working animation. 
Include comments in the JS explaining each calculation step.