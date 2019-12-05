import React, { useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import fragmentShader from "./points-frag.glsl";
import vertexShader from "./points-vert.glsl";

const amount = 250000;

function Scene() {
  const [morph, setMorph] = useState(0);

  const shader = useMemo(
    () => ({
      uniforms: {
        morph: { value: 0 },
        amount: { value: amount }
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
        {...shader}
        uniforms-morph-value={morph}
        derivatives={true}
      />
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={amount}
          array={new Float32Array(amount * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "morphPosition"]}
          count={amount}
          array={new Float32Array(amount * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "size"]}
          count={amount}
          array={new Float32Array(amount)}
          itemSize={1}
        />
        <bufferAttribute
          attachObject={["attributes", "morphSize"]}
          count={amount}
          array={new Float32Array(amount)}
          itemSize={1}
        />
        <bufferAttribute
          attachObject={["attributes", "count"]}
          count={amount}
          array={
            new Float32Array(Array.from({ length: amount }).map((_, i) => i))
          }
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}

export default Scene;
