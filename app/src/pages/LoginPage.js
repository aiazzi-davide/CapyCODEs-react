import { useState, useEffect } from "react";
import { php_url } from "../vars";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const checkLogin = () => {
        fetch(php_url + '/login', {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                
                setIsLoaded(true);
                console.log('Success:', data);
                data.message === 'User already logged in' && window.location.replace('http://localhost:3000/');
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const handleSubmit = (e) => {
        console.log(email + ' ' + password);
        e.preventDefault();
        
        fetch(php_url + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                data.message === 'Login successful' ? window.location.replace('http://localhost:3000/'): alert('Login failed');
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    

    useEffect(() => {
        //setTimeout(() => {
            checkLogin();
        //}, 1000);
    }, []);
    return (
        !isLoaded ? <h1>Loading...</h1> :
            <div>
                <h1>Login Page</h1>
                <form>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange} />
                    <br />
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                    <br />
                    <button type="submit" onClick={handleSubmit}>Login</button>
                </form>
            </div>
        );
};

export default LoginPage;