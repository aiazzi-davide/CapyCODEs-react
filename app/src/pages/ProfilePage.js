import React from 'react';
import { useState, useEffect } from 'react';
import { php_url } from '../vars';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faPlus, faHouse, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css';

const ProfilePage = () => {
    const [data, setData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [showInput, setShowInput] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [dataDiNascita, setDataDiNascita] = useState('');
    const [result, setResult] = useState(null);

    const HandleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const HandleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const HandleNomeChange = (e) => {
        setNome(e.target.value);
    }

    const HandleCognomeChange = (e) => {
        setCognome(e.target.value);
    }

    const HandleDataDiNascitaChange = (e) => {
        setDataDiNascita(e.target.value);
    }

    let navigate = useNavigate();
    function changePassword() {
        navigate('/reset-password');
    }


    function edit(e) {
        setShowInput(e.currentTarget.id);
        console.log(e.currentTarget.id);
    }

    function submit() {
        fetch(php_url + '/editProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                field: showInput,
                value: showInput == 0 ? username : showInput == 1 ? email : showInput == 2 ? nome : showInput == 3 ? cognome : dataDiNascita
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setShowInput(null);
                loadProfile();
                setResult(data.message);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }


    function deleteAccount() {
        fetch(php_url + '/delete-account', {
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

    function redirectHome() {
        navigate('/');
    }

    function setShowInputNull() {
        setShowInput(null);
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
                data.message == 'User not logged in' && navigate('/login');
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
            <h1 className='cdiv'>{data.Username}'s Profile </h1>
            <div className='row-container'>
                <div className='left-container '>
                    <h2>Personal Information</h2> {result ? <p className='p2'>{result}</p> : null}
                    <div className='p1' >Username: {data.Username}
                        {showInput == 0 ? <div className='input-container'>
                            <input className='input input-profile' type='text' onChange={HandleUsernameChange} />
                            <div className='button edit-button' onClick={submit} > <FontAwesomeIcon icon={faCheck} /> </div>
                            <div className='button edit-button'onClick={setShowInputNull} > <FontAwesomeIcon icon={faTrash} /> </div>
                        </div> :
                        <div className='button edit-button' id='0' onClick={edit}>
                            <FontAwesomeIcon icon={faPen} />
                        </div>}
                        
                    </div>
                    <div className='p1' >Email: {data.Email}
                        {showInput == 1 ? <div className='input-container'>
                            <input className='input input-profile' type='email' onChange={HandleEmailChange} />
                            <div className='button edit-button' onClick={submit} > <FontAwesomeIcon icon={faCheck} /> </div>
                            <div className='button edit-button'onClick={setShowInputNull} > <FontAwesomeIcon icon={faTrash} /> </div>
                        </div> :
                        <div className='button edit-button' id='1' onClick={edit}>
                            <FontAwesomeIcon icon={faPen} />
                            </div>}
                    </div>
                    <div className='p1' >First Name: {data.Nome}
                        {showInput == 2 ? <div className='input-container'>
                            <input className='input input-profile' type='text' onChange={HandleNomeChange} />
                            <div className='button edit-button' onClick={submit} > <FontAwesomeIcon icon={faCheck} /> </div>
                            <div className='button edit-button'onClick={setShowInputNull} > <FontAwesomeIcon icon={faTrash} /> </div>
                        </div> :
                        <div className='button edit-button' id='2' onClick={edit}>
                            <FontAwesomeIcon icon={faPen} />
                            </div>}
                    </div>
                    <div className='p1' >Last Name: {data.Cognome}
                        {showInput == 3 ? <div className='input-container'>
                            <input className='input input-profile' type='text' onChange={HandleCognomeChange} />
                            <div className='button edit-button' onClick={submit} > <FontAwesomeIcon icon={faCheck} /> </div>
                            <div className='button edit-button'onClick={setShowInputNull} > <FontAwesomeIcon icon={faTrash} /> </div>
                        </div> :
                        <div className='button edit-button' id='3' onClick={edit}>
                            <FontAwesomeIcon icon={faPen} />
                            </div>}
                    </div>
                    <div className='p1' >Birthday: {data.DataDiNascita}
                        {showInput == 4 ? <div className='input-container'>
                            <input className='input input-profile' type='date' onChange={HandleDataDiNascitaChange} />
                            <div className='button edit-button' onClick={submit} > <FontAwesomeIcon icon={faCheck} /> </div>
                            <div className='button edit-button'onClick={setShowInputNull} > <FontAwesomeIcon icon={faTrash} /> </div>
                        </div> :
                        <div className='button edit-button' id='4' onClick={edit}>
                            <FontAwesomeIcon icon={faPen} />
                            </div>}
                    </div>
                    {/*data.Indirizzo ? <p>Address: {data.Indirizzo}</p> : <div className='button'><FontAwesomeIcon icon={faPlus} /> add address </div>*/}
                </div>
                <div className='right-container profile-container'>
                    <h2 className='h2' >Options</h2>
                    <div className='profile-buttons right-container'>
                        <div className='button' onClick={changePassword}>Change Password <FontAwesomeIcon icon={faPen} /></div>
                        <div className='button' onClick={deleteAccount}>Delete Account <FontAwesomeIcon icon={faTrash} /></div>
                        <div className='button' onClick={redirectHome}> Home <FontAwesomeIcon icon={faHouse} /></div>
                    </div>
                </div>
            </div>
        </div>
    ): <Loading />;
};

export default ProfilePage;