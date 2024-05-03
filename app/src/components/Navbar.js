import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import '../css/Navbar.css';

const Navbar = () => {
    const redirectHome = () => {
        window.location.href = "/";
    };
    return (
        <nav>
            <div className="logo" onClick={redirectHome}>
                <Logo />
            </div>
            <div className="search-bar">
                <SearchBar />
            </div>
            <div className="profile-button">
                <img src="" alt="Profile" />
            </div>
            <div className="cart-button">
                <img src="" alt="Cart" />
            </div>
        </nav>
    );
};

export default Navbar;
