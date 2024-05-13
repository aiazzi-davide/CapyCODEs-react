import React from 'react';
import '../css/App.css';

const Price = ({ errorId, gameId, price, discount }) => {
    return <div>
        {errorId == gameId ?
            <b className="price hithere">{price}
            </b> :
            <b className="price hithere">{price} {price != 'Not available' && <b>€</b>} </b>}
    </div>
};

export default Price;