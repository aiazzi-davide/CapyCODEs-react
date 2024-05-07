import React from 'react';
import { useState, useEffect } from "react";
import { php_url, react_url } from "../vars";
import { useParams } from 'react-router-dom';
import "../css/App.css";

function GamePage() {
    const [data, setData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [game, setGame] = useState({});
    const [price, setPrice] = useState('');
    const [cart, setCart] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState({});
    const { id } = useParams();

    function LoadData() {
        fetch(php_url + '/game/' + id, {
            method: "GET",
            credentials: "include", // Include cookies
        })
            .then((response) => response.json())
            .then((data) => {
                setGame(data);
                /*etPrice(data.price);
                setCart(data.cart);
                setUser(data.user);*/
                console.log("Success:", data);
                setIsLoaded(true);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }

    /*function AddToCart() {
        fetch(php_url + '/cart', {
            method: "POST",
            credentials: "include", // Include cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({game_id: game.id, quantity: quantity})
        })
            .then((response) => response.json())
            .then((data) => {
                setCart(data.cart);
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }

    function RemoveFromCart() {
        fetch(php_url + '/cart/' + game.id, {
            method: "DELETE",
            credentials: "include", // Include cookies
        })
            .then((response) => response.json())
            .then((data) => {
                setCart(data.cart);
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }

    function UpdateCart() {
        fetch(php_url + '/cart/' + game.id, {
            method: "PUT",
            credentials: "include", // Include cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({quantity: quantity})
        })
            .then((response) => response.json())
            .then((data) => {
                setCart(data.cart);
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }*/

    useEffect(() => {
        LoadData();
    }, []);

    /*useEffect(() => {
        setTotal(price.Price * quantity);
    }
        , [quantity, price]);*/
    
    return isLoaded ? (
        <div>
            <div className="game-page">
                <img src={game.background_image} alt={game.name} />
                <h2>{game.name}</h2>
                <p>Price: {price}</p>
                
            </div>
        </div>
    ) : (
        <h1>Loading...</h1>
    );
    /*<p>Quantity: {cart[game.id] ? cart[game.id].quantity : 0}</p>
                <p>Total: {total}</p>
                <button onClick={cart[game.id] ? RemoveFromCart : AddToCart}>{cart[game.id] ? 'Remove from cart' : 'Add to cart'}</button>
                {cart[game.id] && <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />}
                {cart[game.id] && <button onClick={UpdateCart}>Update cart</button>}*/
}

export default GamePage;