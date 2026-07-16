"use client";

import React, { useRef } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function OmModel(props: any) {
  // Load the model
  const { scene } = useGLTF("/history/OM.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Slow, smooth, elegant rotation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={modelRef} {...props} dispose={null}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        {/* We use the scene directly to preserve all materials and meshes of the GLB */}
        <primitive object={scene} />
      </Float>
    </group>
  );
}

// Preload the model for performance
useGLTF.preload("/history/OM.glb");
