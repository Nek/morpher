import React, { useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import fragmentShader from "./points-frag.glsl";
import vertexShader from "./points-vert.glsl";


const count = Array.from({ length: 10000 }).map((_, i) => i);

function Scene() {
  const [morph, setMorph] = useState(0);

  const data = useMemo(
    () => ({
      uniforms: {
        morph: { value: 0 }
      },
      vertexShader,
      fragmentShader
    }),
    []
  );

  useFrame(state => {
    setMorph(Math.sin(state.clock.getElapsedTime()));
  });
  return (
    <points>
      <shaderMaterial
        attach="material"
        {...data}
        uniforms-morph-value={morph}
        derivatives={true}
      />
      <bufferGeometry
        ref={geo => {
          if (geo) {
            geo.setAttribute(
              "position",
              new THREE.BufferAttribute(new Float32Array(30000), 3)
            );

            geo.setAttribute(
              "morphPosition",
              new THREE.BufferAttribute(new Float32Array(30000), 3)
            );
            geo.setAttribute(
              "size",
              new THREE.BufferAttribute(new Float32Array(10000), 1)
            );
            geo.setAttribute(
              "morphSize",
              new THREE.BufferAttribute(new Float32Array(10000), 1)
            );
            geo.setAttribute(
              "count",
              new THREE.BufferAttribute(new Float32Array(count), 1)
            );
          }
        }}
        attach="geometry"
      />
    </points>
  );
}

export default Scene;
