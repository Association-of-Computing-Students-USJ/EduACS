import { lazy, Suspense } from 'react';
import './Hero.css';

// Lazy-load the heavy 3D canvas to avoid blocking initial page render
const ParallaxScene = lazy(() =>
  import('../ParallaxScene').then((module) => ({ default: module.ParallaxScene }))
);

/**
 * Hero — Full-viewport hero section with oversized display typography
 * and a 3D glass card stack interactive element.
 */
export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Ambient glow behind title */}
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__content container">
        <div className="hero__right">
          <Suspense
            fallback={
              <div className="hero__3d-loader">
                <span className="hero__3d-loader-text">Loading 3D Experience...</span>
              </div>
            }
          >
            <ParallaxScene modelPath="/model.glb" scale={1.5} cameraY={5} cameraZ={12} />
          </Suspense>
        </div>

        {/* Main display (Now on right) */}
        <div className="hero__left">
          <h1 className="hero__title">
            <span className="hero__title-line">Edu</span>
            <span className="hero__title-line">
              <span className="hero__title-accent-wrapper">
                <span className="hero__title-accent">A</span>CS
                <span className="hero__title-glow hero__title-glow--orange" aria-hidden="true" />
                <span className="hero__title-glow hero__title-glow--gold" aria-hidden="true" />
                <svg className="hero__title-underline" viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M10 14C100 20 200 20 290 10" stroke="url(#hero-underline-grad)" strokeWidth="6" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="hero-underline-grad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#F3782B" />
                      <stop offset="50%" stopColor="#FFC400" />
                      <stop offset="100%" stopColor="#F3782B" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          </h1>
          <p className="hero__tagline">
            FACULTY OF COMPUTING - USJ
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <span className="hero__scroll-text">Scroll</span>
        <svg
          className="hero__scroll-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

