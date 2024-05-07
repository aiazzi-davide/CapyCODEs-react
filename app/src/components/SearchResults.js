import React, { useEffect, useState } from "react";
import { php_url, react_url } from "../vars";
import Navbar from "./Navbar";
import Loading from "./Loading";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Function to fetch data from the RAWG API
    const fetchData = () => {
      fetch(php_url + "/search?query=" + query, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    };
    // Get the query string from the URL
    const url = new URL(window.location.href);
    const query = url.searchParams.get("q");
    setQuery(query);

    // Fetch data from the RAWG API
    fetchData();
  }, []);

  return isLoaded ? (
    <div>
      <h1>Search Results for "{query}"</h1>
      <div className="container">
        {results.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => (window.location.href = "/game/" + game.id)}
          >
            <img src={game.background_image} alt={game.name} />
            <b>{game.name}</b>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SearchResults;
