import React from 'react';
import '../css/GameCard.css';
import { useState, useEffect } from "react";
import { php_url } from "../vars";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faShoppingCart, faCartPlus } from '@fortawesome/free-solid-svg-icons' 
import Price from './Price';

function GameCard(props) {
    const game = props.game;

    if (props.errorId == game.id) {
        setTimeout(() => {
            props.setErrorId(null);
        }, 1000);
    }
    return (
        <div className="game-card-container">
            <div
                key={game.id}
                id={game.id} 
                className="game-card"
                onClick={() => (window.location.href = "/game/" + game.id)}
            >
                <div className='img-div'>
                    <img className='card-img' src={game.background_image} alt={game.name} />
                </div>
                <div className='title-div'>
                    <b className="game-title">{game.name}</b>
                </div>
                <div className='price-div'>
                    <div className='add-cart-button button'>
                        <FontAwesomeIcon icon={faCartPlus} size='xl' onClick={ (event) => props.addToCart(event, game.id)}/>
                    </div>
                    {/*<Price price={game.price} discount={game.discount} gameId={game.id} errorId={props.errorId} />*/}
                    {props.errorId == game.id ? <b className="price hithere">{game.price} </b> : <b className="price">{game.price} {game.price != 'Not available' && <b>€</b>} </b>}
                </div> 
            </div>
            <div className='card-bg' />
        </div>
    );
};

export default GameCard;       