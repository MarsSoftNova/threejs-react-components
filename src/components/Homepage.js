import React from "react";
import "../assets/css/home.css"
import { Link } from "react-router-dom";

const HomePage = () => (
    <div className="home-page">
        <h1 className="home-title">List</h1>
        <nav className="home-list">
            <ul>
                <li><Link to="/cube-group-rotate">Cube Group Rotation</Link></li>
                <li><Link to="/lab-city">Lab City</Link></li>
            </ul>
        </nav>
    </div>
)

export default HomePage;
