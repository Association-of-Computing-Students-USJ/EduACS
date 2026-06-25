import { useEffect, useRef } from 'react';

/**
 * Tracks the normalized cursor position relative to the viewport center.
 *
 * Returns a ref whose `.current` object has two properties:
 *   - x: normalized horizontal position in the range [-0.5, 0.5]
 *         (−0.5 = far left, 0 = center, +0.5 = far right)
 *   - y: normalized vertical position in the range [-0.5, 0.5]
 *         (−0.5 = top, 0 = center, +0.5 = bottom)
 *
 * Using a ref instead of state is intentional and critical for performance.
 * No component re-renders occur when the mouse moves.
 */
export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
}
