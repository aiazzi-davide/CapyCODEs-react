import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";

const SearchResults = (props) => {
    const [isQuery, setIsQuery] = useState(true);
    const [errorId, setErrorId] = useState(null);

    useEffect(() => {
        if (props.triggerError) {
            console.log('errorId: ', props.triggerError);
            setErrorId(props.triggerError);
            setTimeout(() => {
                props.setTriggerError(false);
            }, 1000);
        }
    }, [props.triggerError]);

    useEffect(() => {
        if (props.query === undefined || props.query === "") {
            setIsQuery(false);
        } else if (props.query !== "") {
            setIsQuery(true);
        }
    }, [props.query]);

    if (!props.isLoaded) {
        props.data.games = Array(24).fill({});
    }

    return (
    <div>
        {isQuery && <h3>Results for "{props.query}"</h3>}
        <div className="container">
            {props.data.games.map((game, index) => (
                <GameCard game={game} key={index} addToCart={props.addToCart} errorId={errorId} setErrorId={setErrorId} isLoaded={props.isLoaded}/>
            ))}
        </div>
    </div>
  );
};

export default SearchResults;
