import React from "react";
import * as THREE from "three";
import { useUpdate } from "react-three-fiber";

function Scene() {
  const vertices = new Float32Array([
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    1.0,
    1.0,

    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0
  ]);

  const ref = useUpdate(geometry => {
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  }, []);

  return (
    <points>
      <bufferGeometry ref={ref} attach="geometry" />
      <pointsMaterial
        attach="material"
        color="#FF0000"
        side={THREE.DoubleSide}
        size={0.1}
      />
    </points>
  );
}

export default Scene;
