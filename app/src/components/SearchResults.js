import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";

const SearchResults = (props) => {
    const [isQuery, setIsQuery] = useState(true);

    useEffect(() => {
        if (props.query === undefined || props.query === "") {
            setIsQuery(false);
        } else if (props.query !== "") {
            setIsQuery(true);
        }
    }, [props.query]);

    return (
    <div>
        {isQuery && <h3>Results for "{props.query}"</h3>}
        <div className="container">
            {props.data.games.map((game) => (
                <GameCard game={game} key={game.id} />
            ))}
        </div>
    </div>
  );
};

export default SearchResults;
