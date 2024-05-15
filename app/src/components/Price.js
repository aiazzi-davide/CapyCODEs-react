import React from 'react';
import { useState, useEffect } from "react";

const Price = ({ priceData }) => {
    const [finalPrice, setFinalPrice] = useState(priceData.Price);
    let final = 0;
    useEffect(() => {
        if (priceData.Price == 'Not available') {
            setFinalPrice('Not available');
            return;
        }
        final = (priceData.Price - (priceData.Price * (priceData.Discount / 100))).toFixed(2);
        console.log(final);
        setFinalPrice(final);
    }, [priceData]);

    return (
    <div className='price-container'>
    {
                priceData.Price != finalPrice && <s className='price-original'>{priceData.Price}</s>
    }
        <bn className='final-price'>{finalPrice}{priceData.Price != 'Not available' && '€'}</bn>
        {priceData.Discount > 0 && <b className='discount'>{priceData.Discount}% </b>}
    </div>
    );
};

export default Price;