import React from 'react';
import '../css/GameCard.css';

function GameCard({game}) {
    return (
        <div className="game-card" id = {game.id}>
            <img src={game.background_image} alt={game.name} />
            <h2>{game.name}</h2>
            <p>{game.released}</p>
        </div>
    );
};

export default GameCard;