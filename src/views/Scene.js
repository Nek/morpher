import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Noise } from "noisejs";
import { useFrame, useRender } from "react-three-fiber";

var noise = new Noise(1);

const vertices = Array.from({ length: 10000 }).flatMap((_, i) => {
  const pX = Math.floor(i / 100) - 50;
  const pY = (i % 100) - 50;
  const pZ = noise.perlin2(Math.floor(i / 100) / 10, (i % 100) / 10) * 10 - 100; //-100 + Math.random() * 20;
  const particle = [pX, pY, pZ];
  return particle;
});

const morphVertices = Array.from({ length: 10000 }).flatMap((_, i) => {
  const pX = Math.floor(i / 100) - 50;
  const pY = (i % 100) - 50;
  const pZ =
    noise.perlin2(Math.floor(i / 100) / 10, (i % 100) / 10) * 100 - 100; //-100 + Math.random() * 20;
  const particle = [pX, pY, pZ];
  return particle;
});

function Scene() {
  return (
    <points
      morphTargetInfluences={[0.5]}
      morphTargetDictionary={{ spikes: morphVertices }}
    >
      <bufferGeometry
        ref={geo => {
          geo.addAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(vertices), 3)
          );

          geo.morphAttributes.position = [];
          geo.morphAttributes.position[0] = new THREE.BufferAttribute(
            new Float32Array(morphVertices),
            3
          );
          geo.morphTargets = [0];
        }}
        attach="geometry"
      />
      <pointsMaterial
        attach="material"
        color="white"
        size={1}
        sizeAttenuation={false}
        morphTargets={true}
      />
    </points>
  );
}

export default Scene;
