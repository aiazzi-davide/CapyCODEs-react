import React from 'react';
import '../css/GameCard.css';
import { useState, useEffect } from "react";
import { php_url } from "../vars";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faShoppingCart, faCartPlus} from '@fortawesome/free-solid-svg-icons' 

function GameCard(props) {
    const game = props.game;

    
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
                    <div className='add-cart-button'>
                        <FontAwesomeIcon icon={faCartPlus} size='xl' onClick={ (event) => props.addToCart(event, game.id)}/>
                    </div>
                    <b className="price">{game.price}</b>
                </div> 
            </div>
            <div className='card-bg' />
        </div>
    );
};

export default GameCard;       