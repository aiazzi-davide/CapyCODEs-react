import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Login from './Login';
import '../css/Navbar.css';
import { useState, useEffect } from 'react';
import { php_url, react_url} from '../vars';

function Navbar(props) {
    const logout = () => {
        fetch(php_url + '/logout', {
          method: 'DELETE',
          credentials: 'include'
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            window.location.href = react_url;
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
    };
    
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
                <Login profile={props.profile} admin={props.admin} />
            </div>
            <div className="cart-button">
                <img src="" alt="Cart" />
            </div>
        </nav>
    );
};

export default Navbar;
