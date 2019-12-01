import React from "react";
import * as THREE from "three";
import { useUpdate } from "react-three-fiber";

function Scene() {
  const vertices = Array.from({ length: 1800 }).map(() => {
    const pX = Math.random() * 500 - 250;
    const pY = Math.random() * 500 - 250;
    const pZ = Math.random() * 500 - 250;
    const particle = new THREE.Vector3(pX, pY, pZ);
    return particle;
  });
  console.log(vertices);
  return (
    <points>
      <geometry attach="geometry" vertices={vertices} />
      <pointsMaterial attach="material" color="#FF0000" size={20} />
    </points>
  );
}

export default Scene;
