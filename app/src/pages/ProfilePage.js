import React from 'react';
import { useState, useEffect } from 'react';
import { php_url } from '../vars';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [data, setData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);


    let navigate = useNavigate();
    function changePassword() {
        navigate('/reset-password');
    }


    function changeInformations() {
        window.location.href = '/changeInformations';
    }

    function deleteAccount() {
        fetch(php_url + '/deleteAccount', {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.href = '/';
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }



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

    return isLoaded ? (
        <div>
            <h1 className='cdiv'>{data.Username}'s Profile</h1>
            <div className='row-container'>
                <div className='left-container '>
                    <h2>Personal Information</h2>
                    <p>Username: {data.Username}</p>
                    <p>Email: {data.Email}</p>
                    <p>First Name: {data.Nome}</p>
                    <p>Last Name: {data.Cognome}</p>
                    <p>Birthday: {data.DataDiNascita}</p>
                    {data.Indirizzo ? <p>Address: {data.Indirizzo}</p> : <div className='button'><FontAwesomeIcon icon={faPlus} /> add address </div>}
                </div>
                <div className='right-container'>
                    <h2>Options</h2>
                    <div className='button' onClick={changePassword}>Change Password <FontAwesomeIcon icon={faPen} /></div>
                    <div className='button' onClick={changeInformations}>Change Informations <FontAwesomeIcon icon={faPen} /></div>
                    <div className='button' onClick={deleteAccount}>Delete Account <FontAwesomeIcon icon={faTrash} /></div>

                </div>
            </div>
        </div>
    ): <Loading />;
};

export default ProfilePage;