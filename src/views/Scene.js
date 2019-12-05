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

const count = Array.from({ length: 10000 }).map((_, i) => i);

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
attribute float count;
varying vec3 vColor;

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Classic Perlin noise, periodic variant
float pnoise(vec2 P, vec2 rep)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
  Pi = mod289(Pi);        // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main() {
    vColor = customColor;
    float k = 100.0;
    vec3 position = vec3(floor(count / k) - 50.0, mod(count, k) - k / 2.0, cnoise(vec2(floor(count / k) / k, mod(count, k) / k)) * 10.0 - 30.0);
    vec3 morphPosition = vec3(floor(count / k) - 50.0, mod(count, k) - 50.0, cnoise(vec2(floor(count / k) / k + k, mod(count, k) / k + k)) * 10.0 - 30.0);
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
