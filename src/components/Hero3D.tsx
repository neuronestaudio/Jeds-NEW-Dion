import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, useTexture, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Snowflake geometry component
function SnowflakeShape() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const spokes = useMemo(() => {
    const spokeGeometry = new THREE.BoxGeometry(0.08, 1.2, 0.04);
    const positions: { rotation: number; scale: number }[] = [];
    
    for (let i = 0; i < 8; i++) {
      positions.push({ rotation: (i * Math.PI) / 4, scale: 1 });
    }
    return { geometry: spokeGeometry, positions };
  }, []);

  return (
    <group ref={meshRef}>
      {/* Center hub */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.05}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          iridescence={0.5}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#5FA7C9"
          transmission={0.9}
        />
      </mesh>
      
      {/* Spokes */}
      {spokes.positions.map((pos, i) => (
        <group key={i} rotation={[Math.PI / 2, 0, pos.rotation]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.06, 0.8, 0.03]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.3}
              chromaticAberration={0.02}
              color="#5FA7C9"
              transmission={0.85}
            />
          </mesh>
          
          {/* Branch details */}
          <mesh position={[0.15, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.2}
              color="#5FA7C9"
              transmission={0.85}
            />
          </mesh>
          <mesh position={[-0.15, 0.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.2}
              color="#5FA7C9"
              transmission={0.85}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Main 3D Logo component
function Logo3DScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float 
        speed={2} 
        rotationIntensity={0.2} 
        floatIntensity={0.3}
      >
        <SnowflakeShape />
      </Float>
    </group>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#5FA7C9" wireframe />
    </mesh>
  );
}

// Canvas wrapper with proper error boundary
export function Hero3DCanvas() {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, 5]} intensity={0.3} color="#5FA7C9" />
          
          <Logo3DScene />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Static fallback for non-WebGL browsers
export function Hero3DFallback() {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
      <div className="relative w-64 h-64 md:w-96 md:h-96">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full animate-spin-slow"
          style={{ animationDuration: '30s' }}
        >
          <defs>
            <linearGradient id="snowflakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(197, 47%, 58%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(197, 42%, 43%)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Simplified snowflake SVG */}
          <g transform="translate(50, 50)" fill="none" stroke="url(#snowflakeGradient)" strokeWidth="2">
            {[0, 45, 90, 135].map((angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <line x1="0" y1="-10" x2="0" y2="-40" />
                <line x1="0" y1="10" x2="0" y2="40" />
                <line x1="-8" y1="-28" x2="0" y2="-35" />
                <line x1="8" y1="-28" x2="0" y2="-35" />
                <line x1="-8" y1="28" x2="0" y2="35" />
                <line x1="8" y1="28" x2="0" y2="35" />
              </g>
            ))}
            <circle r="8" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Hero3DCanvas;
