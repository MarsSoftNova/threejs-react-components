import React from "react";
import "./assets/css/body-canvas.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import CubeGroupRotate from "./components/CubeSelect";
import LabCity from "./components/LabCity";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cube-group-rotate" element={<CubeGroupRotate />} />
                <Route path="/lab-city" element={<LabCity />} />
            </Routes>
        </Router>
    );
};

export default App;
