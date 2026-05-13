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

export default function ModelViewer({ modelUrl, imageUrl }) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [viewMode, setViewMode] = useState("3D");

  return (
    <div className="relative h-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-100 shadow-soft md:h-[460px]">
      <div className="absolute left-4 top-4 z-10 flex overflow-hidden rounded-full border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <button
          onClick={() => setViewMode("3D")}
          className={`px-4 py-1.5 text-xs font-semibold transition ${viewMode === "3D" ? "bg-fibo-blue text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
        >
          3D
        </button>
        <button
          onClick={() => setViewMode("2D")}
          className={`px-4 py-1.5 text-xs font-semibold transition ${viewMode === "2D" ? "bg-fibo-blue text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
        >
          2D
        </button>
      </div>

      {viewMode === "3D" ? (
        <Canvas camera={{ position: [0.4, 0.4, 0.4], fov: 45 }} shadows>
          <ambientLight intensity={0.55} />
          <spotLight position={[10, 10, 10]} intensity={1} castShadow angle={0.2} penumbra={1} />
          <Suspense fallback={<LoadingFallback />}>
            {/* key forces re-mount when modelUrl changes → loads new 3D model */}
            {modelUrl ? <GLTFModel key={modelUrl} url={modelUrl} /> : <FallbackShape />}
          </Suspense>
          <ContactShadows position={[0, -0.05, 0]} opacity={0.35} blur={2} scale={10} far={4} />
          <gridHelper position={[0, -0.05, 0]} args={[10, 20, '#94a3b8', '#e2e8f0']} cellSize={0.1} />
          <Environment preset="city" />
          <OrbitControls
            autoRotate={!isInteracting}
            autoRotateSpeed={3}
            enablePan={false}
            onStart={() => setIsInteracting(true)}
            onEnd={() => setIsInteracting(false)}
          />
        </Canvas>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          {imageUrl ? (
            <img src={imageUrl} alt="Product 2D View" className="h-full w-full object-contain" />
          ) : (
            <div className="text-sm font-medium text-slate-400">No 2D Image Available</div>
          )}
        </div>
      )}
      <div className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
        {viewMode === "3D" ? (modelUrl ? "3D Model" : "Preview") : "2D Image"}
      </div>
    </div>
  );
}
