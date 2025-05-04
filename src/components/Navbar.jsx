// src/components/Navbar.js
import React from "react";

const Navbar = () => (
    <nav className="navbar navbar-dark bg-dark">
        <div className="container">
            <span className="navbar-brand mb-0 h1">
                <img
                    src="/logo.png"
                    alt="PhotoFolio Logo"
                    width="30"
                    height="30"
                    className="d-inline-block align-top me-2"
                />
                Nikita PhotoFolio
            </span>
        </div>
    </nav>
);

export default Navbar;
