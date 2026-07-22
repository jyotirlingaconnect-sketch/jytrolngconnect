"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Bounds } from "@react-three/drei";
import { OmModel } from "./OmModel";

// Loading fallback
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#D4AF6A" wireframe />
    </mesh>
  );
}

export default function OmCanvas() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 4], fov: 40 }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D OM Model"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <hemisphereLight groundColor="#000000" intensity={0.5} />
      
      <Suspense fallback={<Loader />}>
        <Environment preset="sunset" />
        <Bounds fit clip observe margin={1.2}>
          <OmModel />
        </Bounds>
      </Suspense>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}

