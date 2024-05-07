import React from 'react';
import '../css/GameCard.css';
import { useState, useEffect } from "react";
import { php_url } from "../vars";
import "../css/App.css";
import Skeleton from 'react-loading-skeleton';

function GameCard(props) {
    const game = props.game;

    return (
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
            <p className="price">{game.price}</p>
        </div>
    );
};

export default GameCard;

            //{isLoaded ? <p>{data.Price}</p> : <Skeleton />}            