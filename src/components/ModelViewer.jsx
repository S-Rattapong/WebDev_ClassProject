import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";

function GLTFModel({ url }) {
  const { scene } = useGLTF(url);
  // Clone the scene so each instance is independent
  return <primitive object={scene.clone()} scale={1.5} />;
}

function FallbackShape() {
  return (
    <mesh rotation={[0.25, 0.5, 0]} castShadow>
      <boxGeometry args={[2.2, 1.6, 1.6]} />
      <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.08} roughness={0.24} metalness={0.66} />
    </mesh>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#64748b" wireframe />
    </mesh>
  );
}

export default function ModelViewer({ modelUrl }) {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="relative h-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-100 shadow-soft md:h-[460px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} shadows>
        <ambientLight intensity={0.55} />
        <spotLight position={[10, 10, 10]} intensity={1} castShadow angle={0.2} penumbra={1} />
        <Suspense fallback={<LoadingFallback />}>
          {/* key forces re-mount when modelUrl changes → loads new 3D model */}
          {modelUrl ? <GLTFModel key={modelUrl} url={modelUrl} /> : <FallbackShape />}
        </Suspense>
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
        {modelUrl ? "3D Model" : "Preview"}
      </div>
    </div>
  );
}
