import React from 'react';
import '../css/GameCard.css';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faCartPlus } from '@fortawesome/free-solid-svg-icons' 
import 'react-loading-skeleton/dist/skeleton.css'
import Loading from './Loading';

function GameCard(props) {
    const priceData = props.game.priceData;
    const [finalPrice, setFinalPrice] = useState('N');
    const [game, setGame] = useState(props.game);

    let final = 0;
    useEffect(() => {
        if (!props.isLoaded) {
            setGame({
                id: props.key,
                name: <Loading type='skeleton' />,
                background_image: false
            });
        } else {
            setGame(props.game);
        }
        if (props.errorId == game.id) {
            setTimeout(() => {
                props.setErrorId(null);
            }, 1000);
        }

        //controllo se priceData esiste
        if (priceData == undefined) {
            setFinalPrice('');
        } else {
            if (priceData.Price == 'Not available') {
                setFinalPrice('Not available');
            } else {
                final = (priceData.Price - (priceData.Price * (priceData.Discount / 100))).toFixed(2);
                console.log(final);
                setFinalPrice(final);
            }
        }
    }, [props.isLoaded, props.errorId]);


    return (
        <div className="game-card-container">
            <div
                key={props.key}
                id={game.id} 
                className="game-card"
                onClick={() => (window.location.href = "/game/" + game.id)}
            >
                <div className='img-div'>
                    {game.background_image ? <img className='card-img' src={game.background_image} alt={game.name} /> : <Loading type='ic' />}
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