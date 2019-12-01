import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useRender } from "react-three-fiber";

function Scene() {
  const ref = useRef();
  useRender(() => {
    ref.current.normalsNeedUpdate = true;
  }, false);
  return (
    <mesh>
      <geometry
        ref={ref}
        normalize={true}
        computeVertexNormals={true}
        attach="geometry"
        vertices={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(1, 1, 0),
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(1, 0, -1),
          new THREE.Vector3(1, 1, -1),
          new THREE.Vector3(0, 1, -1)
        ]}
        faces={[
          new THREE.Face3(0, 1, 2),
          new THREE.Face3(3, 0, 2),
          new THREE.Face3(4, 5, 6),
          new THREE.Face3(7, 4, 6),
          new THREE.Face3(0, 4, 1),
          new THREE.Face3(1, 4, 5),
          new THREE.Face3(3, 7, 2),
          new THREE.Face3(2, 7, 6)
        ]}
      />
      <meshNormalMaterial attach="material" side={THREE.DoubleSide} />
    </mesh>
  );
}

export default Scene;
