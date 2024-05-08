import { useState, useEffect } from "react";
import { php_url, react_url, checkLogin } from "../vars";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import Loading from "../components/Loading";
import '../css/LoginPage.css';
import '../css/Navbar.css';

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
                data.message === 'Login successful' ? window.location.replace(react_url): alert('Login failed');
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
        isLoaded ?
            <div className="login-page">
                <div className="login-form">
                    <h1>Login Page</h1>
                    <form>
                        <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" className="input" />
                        <br />
                        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" className="input" />
                        <br />
                        <div className="buttons1">
                            <div className="login-button button" type="submit" onClick={handleSubmit}>Login</div>
                            <div className="button" onClick={() => window.location.href = react_url + '/register'}>SignUp</div>
                        </div>
                        <div className="buttons2">
                            <div className="login-button button" onClick={() => window.location.href = '/login/google'}>
                                Login with <FontAwesomeIcon icon={faGoogle} size='lg' />
                            </div>
                            <div className="button" onClick={() => window.location.href = '/reset-password'}>Forgot password?</div>
                        </div>
                    </form>
                </div>
            </div>
        :
    <Loading />
    );
};

export default LoginPage;