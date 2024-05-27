import React from 'react';
import '../css/GameCard.css';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faCartPlus } from '@fortawesome/free-solid-svg-icons' 
import 'react-loading-skeleton/dist/skeleton.css'
import Loading from './Loading';

function GameCard(props) {
    const [priceData, setPriceData] = useState(''); 
    const [finalPrice, setFinalPrice] = useState('');
    const [game, setGame] = useState(props.game);

    let final = 0;
    useEffect(() => {
        if (!props.isLoaded) {
            setGame({
                id: props.id,
                name: '',
                background_image: false
            });
            setPriceData({ Price: '' });
            console.log('loading')
        }

        //controllo se c'è stato un errore
        if (props.errorId == game.id) {
            setTimeout(() => {
                props.setErrorId(null);
            }, 1000);
        }
    }, [props.isLoaded, props.errorId, props.game]);


    useEffect(() => {
        if (props.isLoaded) {

            //setto game e priceData
            setGame(props.game);
            setPriceData(props.game.priceData);
            console.log('loaded', props.game);

            //calcolo prezzo finale
            if (priceData.Price == 'Not available') {
                setFinalPrice('Not available');
            } else {
                final = (priceData.Price - (priceData.Price * (priceData.Discount / 100))).toFixed(2);
                setFinalPrice(final);
            }
        }
    }, [props.isLoaded, props.game, priceData]);

    return (
        <div className="game-card-container">
            <div
                key={props.id}
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
                            {priceData.Price != 'Not available' && priceData.Price != '' && <b>€</b>}
                        </b>}
                </div> 
            </div>
            <div className='card-bg' />
        </div>
    );
};

export default GameCard;       