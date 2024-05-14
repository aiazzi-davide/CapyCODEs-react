import React from 'react';
import { useEffect, useState } from 'react';
import { php_url, react_url } from '../vars';
import Loading from '../components/Loading';
import '../css/CartPage.css';
import Amount from '../components/Amount';
import Item from '../components/Item';
import { parse } from '@fortawesome/fontawesome-svg-core';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [totale, setTotale] = useState(0);

    function loadCart() {
        fetch(php_url + '/cart', {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message == 'User not logged in') {
                    window.location.href = react_url + '/login';
                }
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

    useEffect(() => {
        let tot = 0;
        let final = 0;
        cartItems.forEach(item => {
            final = getFinalPrice(item);
            tot += parseFloat(final) * item.Amount;
        }
        );
        setTotale(tot);
    }, [cartItems]);

    function getFinalPrice(item) {
        let final = 0;
        final = (item.game.priceData.Price - (item.game.priceData.Price * (item.game.priceData.Discount / 100))).toFixed(2);
        return final;
    }

    if (isLoaded) {
        return <div className='cart-page'>
          <div className='left-container'>
            {cartItems.length == 0 ?
              <h1>Il carrello è vuoto</h1>
              :
              <div>
              <h1>cart</h1>
              <table className='table'>
                <tr>
                    <th>Prodotto</th>
                    <th>Quantità</th>
                    <th>Prezzo</th>
                </tr>
                {cartItems.map((item) => (
                <tr key={item.game.id} className='tr'>
                    <td className='td-l' ><Item item={item} /></td>
                        <td className='td-c'><Amount item={item} trigger={trigger} setTrigger={setTrigger} /></td>
                        <td className='td-r' >{item.game.priceData.Price != getFinalPrice(item) && <s>{item.game.priceData.Price}</s>}€ {getFinalPrice(item)} €</td>
                </tr>),)}
              </table>
              </div>
            }
          </div>
          <div className='cart-buttons'>
              <p className='totale'>Totale: {totale}€</p> <br/>
              <div className='button' onClick={() => window.location.href = react_url + '/checkout'}>Checkout</div>
              <div className='button' onClick={() => window.location.href = react_url + '/'}>Continua a comprare</div>
          </div>
        </div>
    } else return <Loading type='fp'/>
}

export default CartPage;