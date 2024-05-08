import React from 'react';
import { useEffect, useState } from 'react';
import { php_url, react_url } from '../vars';
import Loading from '../components/Loading';
import '../css/CartPage.css';
import Amount from '../components/Amount';
import Item from '../components/Item';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const itemsPrice = cartItems.reduce((a, c) => a + c.game.price, 0);

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
    }, [trigger]);
    return isLoaded? 
        <div className='cart-page'>
            <div className='cart-container'>
                <h1>cart</h1>
                <table className='table'>
                        <tr>
                            <th>Prodotto</th>
                            <th>Quantità</th>
                            <th>Prezzo</th>
                        </tr>
                        {cartItems.map((item) => (
                            <tr key={item.game.id} className='tr'>
                                <td className='td-l'><Item item={item} /></td>
                                <td className='td-c'><Amount item={item} trigger={trigger} setTrigger={setTrigger} /></td>
                                <td className='td-r' >{item.game.price}€</td>
                            </tr>
                        ))}
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