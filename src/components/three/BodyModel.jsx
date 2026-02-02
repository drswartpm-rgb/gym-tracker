import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// Muscle group component with glowing material
function MuscleGroup({ position, scale, rotation, color = '#ff4500', intensity = 0.8 }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <capsuleGeometry args={[0.5, 1, 8, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}

// Stylized human body built from primitives
function HumanBody() {
  const groupRef = useRef()

  // Slow rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
  })

  const muscleColor = '#ff4500'
  const bodyColor = '#1a1a2e'
  const highlightColor = '#ff6b35'

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive="#0ff"
          emissiveIntensity={0.1}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Torso - main body */}
      <mesh position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.45, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Chest muscles - pectorals */}
      <MuscleGroup position={[-0.22, 1.55, 0.25]} scale={[0.35, 0.25, 0.2]} color={muscleColor} intensity={0.6} />
      <MuscleGroup position={[0.22, 1.55, 0.25]} scale={[0.35, 0.25, 0.2]} color={muscleColor} intensity={0.6} />

      {/* Abs */}
      <MuscleGroup position={[0, 1.0, 0.3]} scale={[0.3, 0.4, 0.15]} color={highlightColor} intensity={0.5} />

      {/* Obliques */}
      <MuscleGroup position={[-0.35, 1.0, 0.1]} scale={[0.15, 0.35, 0.15]} color={muscleColor} intensity={0.4} />
      <MuscleGroup position={[0.35, 1.0, 0.1]} scale={[0.15, 0.35, 0.15]} color={muscleColor} intensity={0.4} />

      {/* Back muscles - lats */}
      <MuscleGroup position={[-0.3, 1.3, -0.2]} scale={[0.25, 0.35, 0.2]} color={muscleColor} intensity={0.5} />
      <MuscleGroup position={[0.3, 1.3, -0.2]} scale={[0.25, 0.35, 0.2]} color={muscleColor} intensity={0.5} />

      {/* Shoulders - deltoids */}
      <mesh position={[-0.55, 1.75, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={muscleColor}
          emissive={muscleColor}
          emissiveIntensity={0.7}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0.55, 1.75, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={muscleColor}
          emissive={muscleColor}
          emissiveIntensity={0.7}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Upper arms - biceps/triceps */}
      <MuscleGroup position={[-0.7, 1.35, 0]} scale={[0.2, 0.35, 0.2]} rotation={[0, 0, 0.2]} color={muscleColor} intensity={0.6} />
      <MuscleGroup position={[0.7, 1.35, 0]} scale={[0.2, 0.35, 0.2]} rotation={[0, 0, -0.2]} color={muscleColor} intensity={0.6} />

      {/* Forearms */}
      <mesh position={[-0.8, 0.85, 0.05]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive="#0ff"
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[0.8, 0.85, 0.05]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive="#0ff"
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.85, 0.45, 0.08]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0.85, 0.45, 0.08]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Pelvis/hips */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.35, 0.2, 8, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Glutes */}
      <MuscleGroup position={[-0.15, 0.4, -0.2]} scale={[0.2, 0.2, 0.2]} color={muscleColor} intensity={0.4} />
      <MuscleGroup position={[0.15, 0.4, -0.2]} scale={[0.2, 0.2, 0.2]} color={muscleColor} intensity={0.4} />

      {/* Upper legs - quads */}
      <MuscleGroup position={[-0.22, -0.15, 0.08]} scale={[0.22, 0.5, 0.22]} color={muscleColor} intensity={0.6} />
      <MuscleGroup position={[0.22, -0.15, 0.08]} scale={[0.22, 0.5, 0.22]} color={muscleColor} intensity={0.6} />

      {/* Hamstrings */}
      <MuscleGroup position={[-0.22, -0.15, -0.1]} scale={[0.18, 0.45, 0.18]} color={highlightColor} intensity={0.5} />
      <MuscleGroup position={[0.22, -0.15, -0.1]} scale={[0.18, 0.45, 0.18]} color={highlightColor} intensity={0.5} />

      {/* Lower legs - calves */}
      <mesh position={[-0.22, -0.9, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive="#0ff"
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[0.22, -0.9, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive="#0ff"
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Calf muscles */}
      <MuscleGroup position={[-0.22, -0.75, -0.08]} scale={[0.12, 0.25, 0.12]} color={muscleColor} intensity={0.5} />
      <MuscleGroup position={[0.22, -0.75, -0.08]} scale={[0.12, 0.25, 0.12]} color={muscleColor} intensity={0.5} />

      {/* Feet */}
      <mesh position={[-0.22, -1.35, 0.08]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.25]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0.22, -1.35, 0.08]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.25]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  )
}

// Scene with lighting
function Scene() {
  return (
    <>
      {/* Dark background */}
      <color attach="background" args={['#0a0a0f']} />

      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} color="#0ff" />

      {/* Main key light */}
      <pointLight position={[5, 5, 5]} intensity={80} color="#fff" />

      {/* Cyan rim light from behind */}
      <pointLight position={[-3, 2, -5]} intensity={40} color="#0ff" />

      {/* Orange accent light */}
      <pointLight position={[3, 0, 3]} intensity={30} color="#ff4500" />

      {/* Bottom fill light */}
      <pointLight position={[0, -3, 2]} intensity={15} color="#0ff" />

      <Float
        speed={1.5}
        rotationIntensity={0.1}
        floatIntensity={0.3}
      >
        <HumanBody />
      </Float>
    </>
  )
}

// Main exported component
export default function BodyModel({ className = '' }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
