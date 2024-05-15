import { useState, useEffect } from "react";
import { php_url } from "../vars";
import { useParams } from "react-router-dom";
import "../css/App.css";
import "../css/GamePage.css";
import Slideshow from "../components/Slideshow";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { react_url } from "../vars";
import Price from "../components/Price";

function GamePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [game, setGame] = useState({});
  const { id } = useParams();
  const [bounce, setBounce] = useState(false);

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

  const addToCart = (e, game_id) => {
    e.stopPropagation();

    fetch(php_url + "/cart/add/" + game_id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
    .then((response) => response.json())
        .then((data) => {
        console.log("Success:", data);
          data.status == 200 ?
            doBounce()
            : console.log("Error:", data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
  }
  
  function doBounce() {
    setBounce(true);
    setTimeout(() => setBounce(false), 1000);
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
        <p dangerouslySetInnerHTML={{ __html: game.description }}></p>
      </div>
      <div className="game-buttons">
        <Price priceData={game.priceData} />
        {
          game.priceData.Price != 'Not available' && <div className="button center" onClick={(event) => addToCart(event, game.id)}>Add to cart</div>
        }
        <div className="cart-button button top-right-corner">
        {
          bounce ?
          <FontAwesomeIcon className='cart-icon' icon={faShoppingCart} size='2x' onClick={() => window.location.href = react_url + '/cart'} bounce /> :
          <FontAwesomeIcon className='cart-icon' icon={faShoppingCart} size='2x' onClick={() => window.location.href = react_url + '/cart'} />
        }
        </div>
        <div className="button center" onClick={() => (window.location.href = "/")}>Back</div>
        {game.priceData.Discount > 0 && <i>promotion effective until {game.priceData.DateEffectiveTo}</i>}
      </div>
    </div>
  ) : (
    <Loading type='ic' />
  );
}

export default GamePage;
