import React from 'react';
import { useState, useEffect } from 'react';
import { php_url } from '../vars';
import Loading from '../components/Loading';

const ProfilePage = () => {
    const [data, setData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    function loadProfile() {
        fetch(php_url + '/profile', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setData(data);
                setIsLoaded(true);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    useEffect(() => {
        loadProfile();
    }, []);

    return isLoaded ?(
        <div className='pink-page'>
            <div className='cdiv'>
                <h1>{data.Username}'s Profile</h1>

            </div>
        </div>
    ): <Loading />;
};

export default ProfilePage;