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
    return isLoaded? 
        <div>
            <div className='cart-container'>
                <h1>cart</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Prezzo</th>
                            <th>Quantità</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.price}€</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                    <h2>Totale: {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}€</h2>
                </table>
            </div>
            <div className='cart-buttons'>
                <div className='button' onClick={() => window.location.href = react_url + '/checkout'}>Checkout</div>
                <div className='button' onClick={() => window.location.href = react_url + '/'}>Continua a comprare</div>
            </div>
            
        </div>
     : <Loading />;
}

export default CartPage;