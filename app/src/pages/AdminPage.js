import React, { useState, useEffect } from 'react';
import { LoadData, checkAdmin, php_url} from '../vars';
import Navbar from '../components/Navbar';
import Spacer from '../components/Spacer';
import SearchBar from '../components/SearchBar';
import AdminSearchResults from '../components/AdminSearchResults';
import Loading from '../components/Loading';

function AdminPage() {
    // State variables for game price, discount, and discount end date
    const [data, setData] = useState({});
    const [isLoadedAUTH, setIsLoadedAUTH] = useState(false);
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gameId, setGameId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [query, setQuery] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [endDate, setEndDate] = useState('');
    const [result, setResult] = useState(null);

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    }

    const handleDiscountChange = (e) => {
        setDiscount(e.target.value);
    }

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    }

    const setNewPrice = () => {
        fetch(php_url + '/admin/setprice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                gameId: gameId,
                price: price,
                discount: discount,
                endDate: endDate
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                data.status == 200 ? setResult(true) : setResult(false);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }

    

    useEffect(() => {
        // Check if the user is logged in
        checkAdmin(setIsLoadedAUTH);
        LoadData(query, setData, setIsLoadedData);
    }, [query]);

    // Check if the user is logged in and the data is loaded
    useEffect(() => {
        if (isLoadedAUTH && isLoadedData) {
            setIsLoaded(true);
        }
    }, [isLoadedAUTH, isLoadedData]);

    useEffect(() => {
        if (gameId !== null) {
            setShowForm(true);
            console.log('gameId: ', gameId);
        } else {
            setShowForm(false);
        }
    }, [gameId, showForm]);

    return isLoaded ?
        <div>
            <Navbar profile={data.profile} admin={data.admin} setQuery={setQuery} isLoaded={isLoaded} />
            <Spacer />
            <h1 className='title'>Admin Page</h1>
            <h2 className='title1'>Select Game</h2>
            <div className='admin-container'>
                <AdminSearchResults data={data} query={query} setGameId={setGameId} />
                {showForm &&
                    <div className='game-options'>
                        <h3>Game ID: {gameId} </h3>
                        <form>
                            <input className='input' type="text" id="price" name="price" placeholder='set price' onChange={handlePriceChange} /> <br />
                            <input className='input' type="text" id="discount" name="discount" placeholder='discount %' onChange={handleDiscountChange} /> <br />
                            <input className='input' type="date" id="endDate" name="endDate" placeholder='end date' onChange={handleEndDateChange} /> <br />
                            <div className='button' onClick={setNewPrice}>Submit</div>
                            {result == true ? <p className='success'>Price set</p> : result === false && <p className='error'>Error setting price</p>}
                        </form>
                    </div>}
            </div>
        </div> :
        <div className='cdiv'><Loading type={'ic'} /> </div>;
}

export default AdminPage;