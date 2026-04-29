import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";

function ShapeMesh({ shape, color, accent, scale }) {
  const commonProps = {
    castShadow: true,
    scale,
  };

  if (shape === "cylinder") {
    return (
      <mesh {...commonProps} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 2.4, 48]} />
        <meshStandardMaterial color={color} emissive={accent} emissiveIntensity={0.08} roughness={0.28} metalness={0.78} />
      </mesh>
    );
  }

  if (shape === "torus") {
    return (
      <mesh {...commonProps} rotation={[1.2, 0.2, 0]}>
        <torusGeometry args={[1.1, 0.35, 32, 100]} />
        <meshStandardMaterial color={color} emissive={accent} emissiveIntensity={0.1} roughness={0.2} metalness={0.82} />
      </mesh>
    );
  }

  if (shape === "cone") {
    return (
      <mesh {...commonProps} rotation={[0.2, 0.6, 0]}>
        <coneGeometry args={[1.15, 1.8, 6]} />
        <meshStandardMaterial color={color} emissive={accent} emissiveIntensity={0.08} roughness={0.32} metalness={0.6} />
      </mesh>
    );
  }

  if (shape === "capsule") {
    return (
      <mesh {...commonProps} rotation={[0.4, 0.5, 0]}>
        <capsuleGeometry args={[0.65, 1.8, 8, 16]} />
        <meshStandardMaterial color={color} emissive={accent} emissiveIntensity={0.08} roughness={0.22} metalness={0.74} />
      </mesh>
    );
  }

  if (shape === "sphere") {
    return (
      <mesh {...commonProps}>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial color={color} emissive={accent} emissiveIntensity={0.08} roughness={0.22} metalness={0.65} />
      </mesh>
    );
  }

  return (
    <mesh {...commonProps} rotation={[0.25, 0.5, 0]}>
      <boxGeometry args={[2.2, 1.6, 1.6]} />
      <meshStandardMaterial color={color} emissive={accent} emissiveIntensity={0.08} roughness={0.24} metalness={0.66} />
    </mesh>
  );
}

export default function ModelViewer({
  shape = "box",
  color = "#0f172a",
  accent = "#38bdf8",
  scale = 1,
}) {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="relative h-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-100 shadow-soft md:h-[460px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} shadows>
        <ambientLight intensity={0.55} />
        <spotLight position={[10, 10, 10]} intensity={1} castShadow angle={0.2} penumbra={1} />
        <ShapeMesh shape={shape} color={color} accent={accent} scale={scale} />
        <ContactShadows position={[0, -1.6, 0]} opacity={0.35} blur={2} scale={10} far={4} />
        <Environment preset="city" />
        <OrbitControls
          autoRotate={!isInteracting}
          autoRotateSpeed={3}
          enablePan={false}
          onStart={() => setIsInteracting(true)}
          onEnd={() => setIsInteracting(false)}
        />
      </Canvas>
      <div className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
        {/* {isInteracting ? "Manual rotate" : "Auto rotate"} */}
      </div>
    </div>
  );
}
