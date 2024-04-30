import { useEffect, useState } from 'react';
import { php_url, react_url, checkLogin } from '../vars';

function GoogleLoginPage() {

    const [token, setToken] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [birthday, setBirthday] = useState('');

    // funzioni per fetch google
    function googleFetch() {

        fetch(php_url + '/login/google', {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                window.location.replace(data.url);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
        
    }

    // funzioni per fetch token
    function getToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        return token;
    }

    // funzioni per raccolta dati form
    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handlePasswordConfirmationChange(e) {
        setPasswordConfirmation(e.target.value);
    }

    function handleBirthdayChange(e) {
        setBirthday(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(getToken());
        fetch(php_url + '/register/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                password: password,
                birthday: birthday,
                token: getToken(),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                data.status == 200 ? window.location.replace(react_url + '/login') : alert(data.message);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }

    if (getToken() === null){
        googleFetch();
    } else
    {
        return (
            <div>
                <h2>complete your registration</h2>
                <form onSubmit={handleSubmit}>
                    <input type="password" placeholder="password" value={password} onChange={handlePasswordChange} />
                    <input type="password" placeholder="confirm password" value={password_confirmation} onChange={handlePasswordConfirmationChange} />
                    <input type="date" placeholder="birthday" value={birthday} onChange={handleBirthdayChange} />
                    <button type="submit">Submit</button>
                </form>
            </div>);
    }
    

}

export default GoogleLoginPage;