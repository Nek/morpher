import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { Noise } from "noisejs";
import { useFrame, useRender } from "react-three-fiber";

const noise1 = new Noise(1);
const noise2 = new Noise(5);

const vertices = Array.from({ length: 10000 }).flatMap((_, i) => {
  const pX = Math.floor(i / 100) - 50;
  const pY = (i % 100) - 50;
  const pZ =
    noise1.perlin2(Math.floor(i / 100) / 10, (i % 100) / 10) * 10 ; //-100 + Math.random() * 20;
  const particle = [pX, pY, pZ];
  return particle;
});

const morphVertices = Array.from({ length: 10000 }).flatMap((_, i) => {
  const pX = Math.floor(i / 100) - 50;
  const pY = (i % 100) - 50;
  const pZ =
    noise2.perlin2(Math.floor(i / 100) / 10, (i % 100) / 10) * 100 - 20; //-100 + Math.random() * 20;
  const particle = [pX, pY, pZ];
  return particle;
});

function Scene() {
  const [morph, setMorph] = useState(0);

  useFrame(state => {
    setMorph(Math.sin(state.clock.getElapsedTime()));
  });
  return (
    <points
      morphTargetInfluences={[morph]}
      morphTargetDictionary={{ spikes: morphVertices }}
    >
      <bufferGeometry
        ref={geo => {
          if (geo) {
            geo.setAttribute(
              "position",
              new THREE.BufferAttribute(new Float32Array(vertices), 3)
            );

            geo.morphAttributes.position = [];
            geo.morphAttributes.position[0] = new THREE.BufferAttribute(
              new Float32Array(morphVertices),
              3
            );
            geo.morphTargets = [0];
          }
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
