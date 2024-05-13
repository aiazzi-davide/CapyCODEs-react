import React, { useState, useEffect } from 'react';
import { LoadData, checkLogin } from '../vars';
import Navbar from '../components/Navbar';
import Spacer from '../components/Spacer';
import SearchBar from '../components/SearchBar';

function AdminPage (){
    // State variables for game price, discount, and discount end date
    const [data, setData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [gameId, setGameId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [query, setQuery] = useState('');


    // Function to handle setting someone else as admin
    const handleSetAdmin = (userId) => {
        // Logic to set the user with the given userId as admin
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const gameId = e.target.gameId.value;
        setGameId(gameId);
    }

    useEffect(() => {
        // Check if the user is logged in
        checkLogin();
        LoadData(query, setData, setIsLoaded);
    } , []);

    return <div>
                <Navbar profile={data.profile} admin={data.admin} setQuery={setQuery} isLoaded={isLoaded} />
                <Spacer />
            <h1>Admin Page</h1>
            <h2>Select Game</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" id="gameId" name="gameId" placeholder='game id'/>
                <button type="submit">Select</button>
        </form>
        {showForm &&
            <form>
                <input type="text" id="price" name="price" placeholder='price'/>
                <input type="text" id="discount" name="discount" placeholder='discount'/>
                <input type="text" id="endDate" name="endDate" placeholder='end date'/>
                <button type="submit">Submit</button>
            </form>
        }
    </div>;
    
};

export default AdminPage;