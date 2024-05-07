import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Login from './Login';
import '../css/Navbar.css';
import { useState, useEffect } from 'react';
import { php_url, react_url} from '../vars';

function Navbar(props) {
    
    const redirectHome = () => {
        window.location.href = "/";
    };
    return (
        <nav>
            <div className="logo" onClick={redirectHome}>
                <Logo />
            </div>
            <div className="search-bar">
                <SearchBar setQuery = {props.setQuery} />
            </div>
            <div className="profile-button">
                <Login profile={props.profile} admin={props.admin} />
            </div>
            <div className="cart-button">
                <img src="" alt="Cart" />
            </div>
        </nav>
    );
};

export default Navbar;
