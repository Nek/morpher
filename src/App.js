import React from "react";
import { Canvas } from "react-three-fiber";

import Scene from "./views/Scene";
import Controls from "./components/Control";

function App() {
  return (
    <>
      <Canvas>
        <Scene />
        <Controls />
      </Canvas>
    </>
  );
}

export default App;
