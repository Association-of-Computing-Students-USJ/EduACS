import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import gsap from 'gsap';
import { useMouseParallax } from './useMouseParallax';


interface ParallaxModelProps {
  modelPath: string;
  parallaxStrength: number;
  floatAmplitude: number;
  floatSpeed: number;
  scale?: number;
}

/**
 * ParallaxModel
 *
 * Loads a GLB model and applies two layered animations:
 *
 *   1. PARALLAX — The model rotates subtly on X and Y axes in response
 *      to cursor position. The rotation is not 1:1 with the cursor. Instead,
 *      GSAP quickTo eases toward the current cursor value over ~0.8 seconds,
 *      creating the "model has weight" feel.
 *
 *   2. FLOAT — An independent GSAP tween oscillates the model's Y position
 *      with a sine ease, creating an idle breathing motion that runs
 *      continuously regardless of cursor activity.
 */
export function ParallaxModel({
  modelPath,
  parallaxStrength,
  floatAmplitude,
  floatSpeed,
  scale = 1,
}: ParallaxModelProps) {
  // groupRef: reference to the Three.js Group that wraps the loaded model.
  const groupRef = useRef<THREE.Group>(null);

  // mouse: normalized cursor position [-0.5, 0.5] on each axis.
  const mouse = useMouseParallax();

  // smoothed: the interpolated values that GSAP quickTo drives toward the
  // current mouse position.
  const smoothed = useRef({ x: 0, y: 0, floatY: 0 });

  // quickX / quickY: GSAP quickTo setters.
  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    // Implement using GSAP context for clean cleanup of tweens
    const ctx = gsap.context(() => {
      quickX.current = gsap.quickTo(smoothed.current, 'x', {
        duration: 0.8,
        ease: 'power3.out',
      });
      quickY.current = gsap.quickTo(smoothed.current, 'y', {
        duration: 0.8,
        ease: 'power3.out',
      });

      // Idle float animation
      gsap.to(smoothed.current, {
        floatY: floatAmplitude,
        duration: floatSpeed,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    // Pause animation when tab is hidden to save GPU/CPU
    const handleVisibility = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      ctx.revert();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [floatAmplitude, floatSpeed]);

  // Load the GLB model
  const { scene } = useGLTF(modelPath);

  // useFrame: runs inside R3F's existing requestAnimationFrame loop
  useFrame(() => {
    if (!groupRef.current || !quickX.current || !quickY.current) return;

    // Update target values
    quickX.current(mouse.current.x);
    quickY.current(-mouse.current.y); // Negate Y: screen Y is inverted vs world Y

    // Apply rotation for depth feel (parallax only)
    groupRef.current.rotation.y = smoothed.current.x * parallaxStrength;
    groupRef.current.rotation.x = smoothed.current.y * parallaxStrength;

    // Apply floating animation
    groupRef.current.position.y = smoothed.current.floatY;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={scale} />
      </Center>
    </group>
  );
}

// Preload the GLTF file to warm the cache
useGLTF.preload('/model.glb');
