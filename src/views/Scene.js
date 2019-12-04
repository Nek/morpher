import React, { useState, useMemo } from "react";
import * as THREE from "three";
import { Noise } from "noisejs";
import { useFrame } from "react-three-fiber";

const noise1 = new Noise(1);
const noise2 = new Noise(5);

const vertices = Array.from({ length: 10000 }).flatMap((_, i) => {
  const pX = Math.floor(i / 100) - 50;
  const pY = (i % 100) - 50;
  const pZ =
    noise1.perlin2(Math.floor(i / 100) / 100, (i % 100) / 100) * 10 - 30;
  const particle = [pX, pY, pZ];
  return particle;
});

const color = new THREE.Color(0xffffff);
const colors = Array.from({ length: 10000 }).flatMap((_, i) => {
  return color.toArray();
});

const sizes = Array.from({ length: 10000 }).flatMap((_, i) => {
  const pZ = noise2.perlin2(Math.floor(i / 100) / 10, (i % 100) / 10);
  return pZ;
});

const morphVertices = Array.from({ length: 10000 }).flatMap((_, i) => {
  const pX = Math.floor(i / 100) - 50;
  const pY = (i % 100) - 50;
  const pZ = noise2.perlin2(Math.floor(i / 100) / 10, (i % 100) / 10) * 50 - 30;
  const particle = [pX, pY, pZ];
  return particle;
});

function Scene() {
  const [morph, setMorph] = useState(0);

  const data = useMemo(
    () => ({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: {
          type: "t",
          value: new THREE.TextureLoader().load("assets/circle.png")
        },
        morph: { value: 0 }
      },
      vertexShader: `
      uniform float morph;
attribute float size;
attribute vec3 customColor;
attribute vec3 morphPosition;
varying vec3 vColor;
void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position * morph + morphPosition * (1.0 - morph), 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}`,
      fragmentShader: `
uniform vec3 color;
uniform sampler2D pointTexture;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4( color * vColor, 1.0 );
    //gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}`
      // blending: THREE.AdditiveBlending,
      // depthTest: false,
      // transparent: true,
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
      />
      <bufferGeometry
        ref={geo => {
          if (geo) {
            geo.setAttribute(
              "position",
              new THREE.BufferAttribute(new Float32Array(vertices), 3)
            );

            geo.setAttribute(
              "morphPosition",
              new THREE.BufferAttribute(new Float32Array(morphVertices), 3)
            );
            geo.setAttribute(
              "customColor",
              new THREE.BufferAttribute(new Float32Array(colors), 3)
            );
            geo.setAttribute(
              "size",
              new THREE.BufferAttribute(new Float32Array(sizes), 1)
            );
          }
        }}
        attach="geometry"
      />
    </points>
  );
}

export default Scene;
