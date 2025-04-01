import React from "react";
import Scene from "./components/Scene";
import "./assets/css/main.css";

function App() {
    return (
        <div>
            <div id="info">Click: Select cube | Hover: Highlight | Space: Pause</div>
            <Scene />
        </div>
    );
}

export default App;
