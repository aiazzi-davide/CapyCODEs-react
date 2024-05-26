import React, { useState } from 'react';
import { php_url} from '../vars';

const Amount = ({item, trigger, setTrigger}) => {

    const increaseQuantity = () => {
        fetch(php_url + "/cart/add/" + item.game.id, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setTrigger(!trigger);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const decreaseQuantity = () => {
        fetch(php_url + "/cart/remove/" + item.game.id, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setTrigger(!trigger);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    return (
        <div className='amount'>
            <div onClick={decreaseQuantity} className='s-button' >-</div>
            <span>{item.Amount}</span>
            <div onClick={increaseQuantity} className='s-button'>+</div>
        </div>
    );
};

export default Amount;