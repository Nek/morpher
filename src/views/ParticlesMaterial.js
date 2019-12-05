import * as THREE from "three";

export class ParticlesMaterial extends THREE.ShaderMaterial {
  constructor(options) {
    super({
      vertexShader: `
attribute float size;
attribute vec3 customColor;
varying vec3 vColor;
void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}`,
      fragmentShader: `
uniform vec3 color;
uniform sampler2D pointTexture;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4( color * vColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}`,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    this.uniforms = {
      color: { value: options.color },
      pointTexture: { value: options.pointTexture }
    };
  }
}