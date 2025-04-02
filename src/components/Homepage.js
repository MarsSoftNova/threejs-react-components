import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
    <div>
        <h1>Home Page</h1>
        <nav>
            <ul>
                <li><Link to="/scene1">Go to Page 1</Link></li>
                <li><Link to="/scene2">Go to Page 2</Link></li>
            </ul>
        </nav>
    </div>
)

export default HomePage;
