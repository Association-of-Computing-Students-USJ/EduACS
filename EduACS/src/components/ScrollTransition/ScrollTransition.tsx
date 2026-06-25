import { useEffect, useRef } from 'react';

// ─── Brand Palette ────────────────────────────────────────────────────────────
// All values sourced from src/index.css design tokens — no arbitrary colors.

/** --color-bg: mint green — Section 1 light background & SVG curtain fill. */
const LIGHT_BG = '#DCE9D8';

/** --color-text-secondary: deep teal — Section 2 dark background. */
const DARK_BG = '#174645';

/** --color-text-primary: teal — Section 1 headings. */
const TEXT_PRIMARY = '#206261';

/** --color-text-muted: muted teal — Section 1 body / subtitle. */
const TEXT_MUTED = '#357A79';

/** --color-text-inverse: mint — all text on the dark Section 2. */
const TEXT_INVERSE = '#DCE9D8';

/** --color-accent: orange — numbers, highlights, and stat values. */
const ACCENT = '#F3782B';
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Linear interpolation: a + (b - a) * t
 * Converts normalised scroll progress to coordinate values.
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Symmetric cubic ease-in-out.
 * Produces a continuous, non-snapping animation with smooth start and end.
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * ScrollTransition
 *
 * Scroll-driven "rising convex dome" transition between two full-height
 * sections, inspired by string-tune.fiddle.digital.
 *
 * STICKY SCROLL TECHNIQUE:
 *   1. A 800vh wrapper provides a slow, comfortable scroll-through.
 *   2. A position:sticky child remains pinned to the viewport throughout.
 *   3. Z-stack (bottom → top) inside the sticky frame:
 *        z=1 — Section 2 (dark About content) — always rendered
 *        z=2 — SVG curtain — mint dome that rises, revealing dark below
 *        z=3 — Section 1 content — transparent background, floats above
 *
 * CLIPPING STRATEGY:
 *   The SVG path (z=2) provides the visual background for Section 1.
 *   Section 1 content (z=3) has a TRANSPARENT background, so it naturally
 *   appears to "sit on" the SVG curtain. When the dome exits the top, the
 *   light background disappears beneath the text, but the text itself
 *   remains readable because it rides above the mint fill.
 *
 *   To hide Section 1 content as the dome leaves, we apply a CSS
 *   `clip-path: polygon(...)` using PERCENTAGE values (0%–100% of the
 *   element's own dimensions). We compute the polygon from the dome math
 *   converted to percentage coordinates — this avoids all coordinate
 *   system mismatch issues.
 *
 * RAF LOOP (zero external libraries):
 *   A scroll listener sets `dirty=true`. RAF only repaints on dirty frames.
 */
export default function ScrollTransition() {
  const zoneRef     = useRef<HTMLDivElement>(null);
  /** The SVG <path> element — the visible dome fill. */
  const svgPathRef  = useRef<SVGPathElement>(null);
  /** The SVG <svg> element — viewBox is synced to px dimensions each frame. */
  const svgRef      = useRef<SVGSVGElement>(null);
  /** Section 1 content wrapper — clip-path: polygon() applied each frame. */
  const s1Ref       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let dirty = true;

    /**
     * Calculates scroll progress through the 800vh zone → [0, 1].
     * 0 = zone just entered viewport; 1 = zone fully scrolled past.
     */
    const getProgress = (): number => {
      if (!zoneRef.current) return 0;
      const rect = zoneRef.current.getBoundingClientRect();
      const scrollable = zoneRef.current.offsetHeight - window.innerHeight;
      const raw = -rect.top / scrollable;
      return Math.max(0, Math.min(1, raw));
    };

    const tick = () => {
      if (dirty) {
        dirty = false;

        const W = window.innerWidth;
        const H = window.innerHeight;
        const p = easeInOutCubic(getProgress());

        // ── Dome math ──────────────────────────────────────────────────────
        //
        // sideY: Y coordinate of the dome base anchors, in pixels.
        //   Lerps from 125% of viewport height (off-screen bottom) to
        //   -30% of viewport height (off-screen top).
        const sideY = lerp(H * 1.25, H * -0.3, p);

        // domeBulge: max height of the convex hill above the side anchors.
        //   sin(p·π) bell-curve: 0 at p=0, peak at p=0.5, 0 at p=1.
        //   35% of viewport height at maximum bulge.
        const domeBulge = Math.sin(p * Math.PI) * (H * 0.35);

        // peakY: the Bezier control point Y.
        //   Always LESS than sideY → centre is higher → convex hill (not a bowl).
        const peakY = sideY - domeBulge;

        // ── SVG path (in pixel coordinates, viewBox synced below) ──────────
        //
        // M0,0 → top-left corner
        // L{W},0 → top-right corner
        // L{W},{sideY} → right dome anchor
        // Q{W/2},{peakY} → quadratic Bezier through elevated centre
        // 0,{sideY} → left dome anchor (implicit endpoint of Q)
        // Z → close back to M0,0
        const d = `M0,0 L${W},0 L${W},${sideY} Q${W / 2},${peakY} 0,${sideY} Z`;

        if (svgPathRef.current) svgPathRef.current.setAttribute('d', d);
        // Sync viewBox to actual pixel dimensions so SVG coords == px coords.
        if (svgRef.current) svgRef.current.setAttribute('viewBox', `0 0 ${W} ${H}`);

        // ── CSS polygon clip-path for Section 1 content ────────────────────
        //
        // clip-path: polygon() uses PERCENTAGES relative to the element's
        // own bounding box (100% = element width/height), avoiding the
        // "viewport vs element coordinate space" mismatch of path().
        //
        // We convert the dome shape to percentages:
        //   sideY_pct  = sideY / H * 100  (% of element height = % of 100vh)
        //   peakY_pct  = peakY / H * 100
        //   50% = horizontal centre (W/2 as a fraction)
        //
        // The polygon follows the SAME shape as the SVG path:
        //   top-left (0%,0%) → top-right (100%,0%) → right anchor (100%, sideY%)
        //   → centre peak (50%, peakY%) → left anchor (0%, sideY%)
        // The polygon is automatically closed back to (0%,0%).
        const sP = (sideY / H) * 100;
        const kP = (peakY / H) * 100;
        const polygon = `polygon(0% 0%, 100% 0%, 100% ${sP}%, 50% ${kP}%, 0% ${sP}%)`;

        if (s1Ref.current) s1Ref.current.style.clipPath = polygon;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => { dirty = true; };
    const onResize = () => { dirty = true; };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Initial polygon: full rectangle (sideY=125%, peakY=125% — flat bottom edge).
  const INITIAL_POLY = 'polygon(0% 0%, 100% 0%, 100% 125%, 50% 125%, 0% 125%)';

  return (
    // ── Scroll Zone ── 800vh gives a leisurely, deliberate animation pace
    <div ref={zoneRef} style={{ height: '800vh', position: 'relative' }}>

      {/* ── Sticky Frame ── stays pinned to viewport top for full 800vh ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >

        {/* ── SECTION 2 — Dark ──────────────────────────────────────────────
            z-index 1: back of the z-stack.
            Always fully rendered; the SVG curtain hides it at scroll=0
            and progressively exposes it as the dome rises. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: DARK_BG,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 clamp(1.5rem, 4vw, 4rem)',
          }}
        >
          <span
            style={{
              display: 'block',
              color: ACCENT,
              fontSize: '0.75rem',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            About Us
          </span>

          <h2
            style={{
              color: TEXT_INVERSE,
              fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              maxWidth: '860px',
              margin: '0 0 2rem',
            }}
          >
            We change the destany of {' '}
            <span style={{ color: ACCENT }}>the students</span> and{' '}
            <span style={{ color: ACCENT }}>deliver results</span>.
          </h2>

          <p  
            style={{
              color: TEXT_INVERSE,
              opacity: 0.65,
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              fontFamily: "'Inter', sans-serif",
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            EduACS is the premier student tech community at the Faculty of Computing,
            University of Sri Jayewardenepura. We help A/L students prepare for their academical exam by conducting seminars and other educational activities.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 'clamp(2rem, 6vw, 5rem)',
              marginTop: '3rem',
              paddingTop: '2.5rem',
              borderTop: `1px solid rgba(220,233,216,0.15)`,
            }}
          >
            {[
              { number: '200+', label: 'Active Members' },
              { number: '2+',  label: 'Events / Year' },
              { number: '20+',  label: 'Seminars Conducted' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'block',
                    color: ACCENT,
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  {stat.number}
                </span>
                <span
                  style={{
                    display: 'block',
                    color: TEXT_INVERSE,
                    opacity: 0.5,
                    fontSize: '0.7rem',
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginTop: '0.5rem',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SVG CURTAIN ─────────────────────────────────────────────────────
            z-index 2: the animated dome shape.
            Fill = LIGHT_BG (mint green) — matches Section 1 background.
            viewBox is updated each frame to match actual pixel dimensions
            so that SVG user coordinates == CSS pixel coordinates.
            pointer-events:none — never intercepts mouse/touch events. */}
        <svg
          ref={svgRef}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <path
            ref={svgPathRef}
            // Initial: solid rectangle, sideY ≈ 1125 (125% of 900px viewBox).
            d="M0,0 L1440,0 L1440,1125 Q720,1125 0,1125 Z"
            fill={LIGHT_BG}
          />
        </svg>

        {/* ── SECTION 1 CONTENT ────────────────────────────────────────────────
            z-index 3: in front of everything.
            clip-path: polygon(...) uses PERCENTAGE coordinates relative to
            this element's own bounding box (which is 100vw × 100vh).
            The polygon mirrors the dome shape, so Section 1 content is ONLY
            visible where the mint curtain exists. As the dome exits the top,
            Section 1 content clips away with it. */}
        <div
          ref={s1Ref}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            clipPath: INITIAL_POLY,
            backgroundColor: LIGHT_BG, // fills the clipped region with light bg
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 clamp(1.5rem, 4vw, 4rem)',
          }}
        >
          {/* Large 10vw display word */}
          <h2
            style={{
              color: TEXT_PRIMARY,
              fontSize: '10vw',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Join With US..
          </h2>

          {/* Subtitle — uppercase tracking */}
          <p
            style={{
              color: TEXT_MUTED,
              fontSize: '0.8rem',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginTop: '1.5rem',
              textAlign: 'center',
            }}
          >
            Faculty of Computing · University of Sri Jayewardenepura
          </p>

          {/* Four feature columns at the bottom — (01)(02)(03)(04) */}
          <div
            style={{
              position: 'absolute',
              bottom: '8vh',
              left: 'clamp(1.5rem, 4vw, 4rem)',
              right: 'clamp(1.5rem, 4vw, 4rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
            }}
          >
            {[
              { n: '01', title: 'A/L ICT Seminars', desc: 'Free seminars conducted for Grade 13 ICT students.' },
              { n: '02', title: 'Grade 12 -13 Studentd',   desc: 'Free ICT classes conducted for Grade 12 students.' },
              { n: '03', title: 'Uni Life',  desc: 'Share the university life experiences with school studets' },
              { n: '04', title: 'Getting start with ICT', desc: 'Collaborative projects that give back to the global dev community.' },
            ].map(item => (
              <div key={item.n}>
                <span
                  style={{
                    display: 'block',
                    color: ACCENT,
                    fontSize: '0.7rem',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    marginBottom: '0.5rem',
                  }}
                >
                  ({item.n})
                </span>
                <strong
                  style={{
                    display: 'block',
                    color: TEXT_PRIMARY,
                    fontSize: '0.85rem',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                  }}
                >
                  {item.title}
                </strong>
                <p
                  style={{
                    color: TEXT_MUTED,
                    fontSize: '0.78rem',
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
