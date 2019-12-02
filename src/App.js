import React from "react";
import { Canvas } from "react-three-fiber";
import polyfill from "@juggle/resize-observer";

import Scene from "./views/Scene";
import Controls from "./components/Controls";

function App() {
  return (
    <>
      <Canvas resize={{ polyfill }}>
        <Scene />
        <Controls />
      </Canvas>
    </>
  );
}

export default App;
