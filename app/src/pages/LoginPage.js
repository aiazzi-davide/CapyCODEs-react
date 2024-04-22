import { useState, useEffect } from "react";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        console.log(email);
        e.preventDefault();
        
        fetch('http://localhost:81/login', {
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
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const checkLogin = () => {
        fetch('http://localhost:81/login', {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                console.log(data.profile);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    useEffect(() => {
        checkLogin();
    }, []);

    return (
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