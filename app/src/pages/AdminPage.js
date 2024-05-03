import React, { useState, useEffect } from 'react';
import { checkLogin } from '../vars';

function AdminPage (){
    // State variables for game price, discount, and discount end date
    const [gamePrice, setGamePrice] = useState(0);
    const [gameDiscount, setGameDiscount] = useState(0);
    const [discountEndDate, setDiscountEndDate] = useState('');

    // Function to handle changing the price of a game
    const handleChangeGamePrice = (event) => {
        const newPrice = event.target.value;
        setGamePrice(newPrice);
    };

    // Function to handle changing the discount of a game
    const handleChangeGameDiscount = (event) => {
        const newDiscount = event.target.value;
        setGameDiscount(newDiscount);
    };

    // Function to handle changing the end date of a discount
    const handleChangeDiscountEndDate = (event) => {
        const newEndDate = event.target.value;
        setDiscountEndDate(newEndDate);
    };

    // Function to handle setting someone else as admin
    const handleSetAdmin = (userId) => {
        // Logic to set the user with the given userId as admin
    };

    useEffect(() => {
        // Check if the user is logged in
        checkLogin()
    } , []);

    return (
        <div>
            <h1>Admin Page</h1>

            <h2>Change Game Price</h2>
            <input type="number" value={gamePrice} onChange={handleChangeGamePrice} />

            <h2>Change Game Discount</h2>
            <input type="number" value={gameDiscount} onChange={handleChangeGameDiscount} />

            <h2>Change Discount End Date</h2>
            <input type="date" value={discountEndDate} onChange={handleChangeDiscountEndDate} />

            <h2>See All Users</h2>
            {/* Logic to fetch and display all registered users */}

            <h2>Set Someone as Admin</h2>
            {/* Logic to fetch and display all users, and handle setting someone as admin */}
        </div>
    );
};

export default AdminPage;