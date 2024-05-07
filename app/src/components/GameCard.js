import React from 'react';
import '../css/GameCard.css';
import { useState, useEffect } from "react";
import { php_url } from "../vars";
import "../css/App.css";
import Skeleton from 'react-loading-skeleton';

function GameCard(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState({});
    const game = props.game;

    function LoadData() {
        fetch(php_url + '/game/' + game.id + '/price', {
            method: "GET",
            credentials: "include", // Include cookies
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                console.log("Success:", data);
                setIsLoaded(true);
                return data.price;
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }
    
    useEffect(() => {
        LoadData();
    }, []);
    return (
        <div className="game-card" id = {game.id} onClick={() => window.location.href = '/game/' + game.id}>
            <img src={game.background_image} alt={game.name} />
            <h2>{game.name}</h2>
            {isLoaded ? <p>{data.Price}</p> : <Skeleton />}            
        </div>
    );
};

export default GameCard;