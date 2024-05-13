import React, { useEffect, useState } from "react";
import '../css/Admin.css';
const SearchResults = ({setGameId, data}) => {
    


    return (
        <div className="results">
            {data.games.map((game) => (
                <div className="result-admin" onClick={() => {setGameId(game.id)}} key={game.id}>
                    <div className="img-container">
                        <img src={game.background_image} className="img" />
                    </div>
                    {game.name} - {game.released} - {game.id}
                </div> 
            ))}
        </div>
  );
};

export default SearchResults;
