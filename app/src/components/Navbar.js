import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Login from './Login';
import '../css/Navbar.css';
import { useState, useEffect } from 'react';
import { php_url, react_url } from '../vars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faShoppingCart} from '@fortawesome/free-solid-svg-icons'

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
                <FontAwesomeIcon icon={faShoppingCart} size='2x' onClick={() => window.location.href = react_url + '/cart'}/>
            </div>
        </nav>
    );
};

export default Navbar;
