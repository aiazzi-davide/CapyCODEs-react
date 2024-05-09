import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Login from './Login';
import '../css/Navbar.css';
import { useState, useEffect } from 'react';
import { php_url, react_url } from '../vars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faShoppingCart} from '@fortawesome/free-solid-svg-icons'
import Loading from './Loading';

function Navbar(props) {
    const redirectHome = () => {
        window.location.href = "/";
    };

    useEffect(() => {
        props.bounce && setTimeout(() => props.setBounce(false), 1000);
    }, [props.bounce]);
    return (
        <nav>
            <div className="logo" onClick={redirectHome}>
                <Logo />
            </div>
            <div className="search-bar">
                <SearchBar setQuery = {props.setQuery} />
            </div>

                <div className="profile-button">
                    <Login profile={props.profile} admin={props.admin} isLoaded={props.isLoaded}/>
                </div>

            <div className="cart-button button">
                {
                    props.bounce ?
                        <FontAwesomeIcon className='cart-icon' icon={faShoppingCart} size='2x' onClick={() => window.location.href = react_url + '/cart'} bounce /> :
                        <FontAwesomeIcon className='cart-icon' icon={faShoppingCart} size='2x' onClick={() => window.location.href = react_url + '/cart'} />
                }
            </div>
        </nav>
    );
};

export default Navbar;
