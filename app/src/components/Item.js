import React from 'react';

const Item = ({ item }) => {
    return (
        <div className='item-container'>
            <img src={item.game.background_image} alt={item.game.name} className='item-img'/>
            <b className='item.name'>{item.game.name}</b>
        </div>
    );
};

export default Item;