import React from 'react';

const Item = ({ item }) => {
    const redirectToGame = (id) => {
        window.location.href = '/game/' + id;
      }
    return (
        <div className='item-container' onClick={redirectToGame.bind(this, item.game.id)}>
            <div className='cart-img-container'>
                <img src={item.game.background_image} alt={item.game.name} className='item-img' />
            </div>
            <b className='item.name'>{item.game.name}</b>
        </div>
    );
};

export default Item;