import React from 'react';
import { useEffect, useState } from 'react';
import { php_url, react_url } from '../vars';
import Loading from '../components/Loading';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    function loadCart() {
        fetch(php_url + '/cart', {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setCartItems(data.items);
                console.log("Success:", data);
                setIsLoaded(true);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }

    useEffect(() => {
        loadCart();
    }, []);
    return isLoaded? (
        <div>
            <h1>Carrello</h1>
            {cartItems.map((item, index) => (
                <div key={index}>
                    <h2>{item.game.name}</h2>
                    <p>{item.game.price}€</p>
                </div>
            ))}
            <h2>Totale: {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}€</h2>
        </div>
    ) : (
        <Loading />
    );
}

export default CartPage;