import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ParallaxModel } from './ParallaxModel';

interface ParallaxSceneProps {
  modelPath?: string;
  parallaxStrength?: number;
  floatAmplitude?: number;
  floatSpeed?: number;
  cameraY?: number;
  cameraZ?: number;
  scale?: number;
}

/**
 * ParallaxScene — the public-facing wrapper component.
 *
 * Responsibilities:
 *   - Creates the WebGL Canvas
 *   - Configures the camera
 *   - Provides lighting
 *   - Wraps ParallaxModel in a Suspense boundary for async GLB loading
 */
export function ParallaxScene({
  modelPath = '/model.glb',
  parallaxStrength = 0.25,
  floatAmplitude = 0.08,
  floatSpeed = 1.5,
  cameraY = 0,
  cameraZ = 3.5,
  scale = 1,
}: ParallaxSceneProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [0, cameraY, cameraZ], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, cameraY, cameraZ]} fov={45} />

        {/* Ambient: fills all shadow areas with a base level of light */}
        <ambientLight intensity={0.8} />

        {/* Key light: main directional light from upper-right front */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          castShadow={false}
        />

        {/* Fill light: softens harsh shadows on the opposite side */}
        <directionalLight
          position={[-5, -2, -5]}
          intensity={0.4}
        />

        <Suspense fallback={null}>
          <ParallaxModel
            modelPath={modelPath}
            parallaxStrength={parallaxStrength}
            floatAmplitude={floatAmplitude}
            floatSpeed={floatSpeed}
            scale={scale}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
