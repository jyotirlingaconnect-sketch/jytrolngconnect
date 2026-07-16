"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { OmModel } from "./OmModel";

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
      <Environment preset="sunset" />
      
      <OmModel />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}
