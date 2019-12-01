import React from "react";

function Scene() {
  return (
    <mesh>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
}

export default Scene;
