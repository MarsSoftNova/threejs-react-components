import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import Scene1 from "./components/CubeSelect";
import Scene2 from "./components/LabCity";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/scene1" element={<Scene1 />} />
                <Route path="/scene2" element={<Scene2 />} />
            </Routes>
        </Router>
    );
};

export default App;
