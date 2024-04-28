import { useState, useEffect } from "react";
import { php_url, react_url, checkLogin } from "../vars";

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

    const resetPassword = () => {
        fetch(php_url + '/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                data.message === 'Email sent' ? alert('Email sent') : alert('Email not sent');
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }

    

    useEffect(() => {
        //setTimeout(() => {
            checkLogin(setIsLoaded);
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
                    <br />
                    <p> Or login with <a href="/login/google">Google</a></p>
                    <p>Forgot your password? <a href="/reset-password">Reset Password</a></p>
                    <p>New here? <a href="/register">Sign up</a></p>
                </form>
            </div>
        );
};

export default LoginPage;