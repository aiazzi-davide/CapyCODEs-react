import { useState, useEffect } from "react";
import { php_url } from "../vars";
import { useParams } from "react-router-dom";
import "../css/App.css";
import "../css/GamePage.css";
import Slideshow from "../components/Slideshow";
import Loading from "../components/Loading";

function GamePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [game, setGame] = useState({});
  const [price, setPrice] = useState("");
  const { id } = useParams();

  function LoadData() {
    fetch(php_url + "/game/" + id, {
      method: "GET",
      credentials: "include", // Include cookies
    })
      .then((response) => response.json())
      .then((data) => {
        setGame(data);
        console.log("Success:", data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }
    
    function redirectMetecritic() {
        window.open(game.metacritic_url, "_blank");
    }

  useEffect(() => {
    LoadData();
  }, []);

  return isLoaded ? (
    <div className="cart-page">
      <div className="left-container">
        <div className="img-container">
                  <Slideshow gameId = {game.id} />
        </div>
        <h2>{game.name}</h2>
        <p onClick={redirectMetecritic}>rating: {game.rating}/5</p>
      </div>
      <div className="cart-buttons">
        <button className="button" onClick={() => (window.location.href = "/")}>
          Back
        </button>
      </div>
    </div>
  ) : (
    <Loading type='ic' />
  );
}

export default GamePage;
