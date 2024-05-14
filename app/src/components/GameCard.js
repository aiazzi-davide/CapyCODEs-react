import React from 'react';
import '../css/GameCard.css';
import { useState, useEffect } from "react";
import { php_url } from "../vars";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faShoppingCart, faCartPlus } from '@fortawesome/free-solid-svg-icons' 

function GameCard(props) {
    const game = props.game;
    const priceData = props.game.priceData;
    const [finalPrice, setFinalPrice] = useState(priceData.Price);

    if (props.errorId == game.id) {
        setTimeout(() => {
            props.setErrorId(null);
        }, 1000);
    }

    let final = 0;
    useEffect(() => {
        if (priceData.Price == 'Not available') {
            setFinalPrice('Not available');
            return;
        }
        final = (priceData.Price - (priceData.Price * (priceData.Discount / 100))).toFixed(2);
        console.log(final);
        setFinalPrice(final);
    }, [priceData]);

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
                    {props.errorId == game.id ?
                        <b className="price hithere">
                            {finalPrice}
                        </b> :
                        <b className="price">
                            {finalPrice != priceData.Price && <s>{priceData.Price}€</s>} <span> </span>
                            {finalPrice}
                            {priceData.Price != 'Not available' && <b>€</b>}
                        </b>}
                </div> 
            </div>
            <div className='card-bg' />
        </div>
    );
};

export default GameCard;       