import { useState, useEffect} from 'react';
import { php_url, checkLogin } from "../vars";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'
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
                data.message === 'Login successful' ? window.location.href = '/' : alert(data.message);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    useEffect(() => {
        checkLogin(setIsLoaded);
    }, []);

    return (
        isLoaded ?
            <div className="pink-page">
                <div className="login-form">
                    <h1 className="h1">Login to CapyCODEs</h1>
                    <div className="left-container login">
                        <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" className="input" />
                        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" className="input" />
                        <div className="buttons1">
                            <div className="login-button button" type="submit" onClick={handleSubmit}>Login</div>
                            <div className="button" onClick={() => window.location.href = '/register'}>SignUp</div>
                        </div>
                    </div>
                    <div className="right-container buttons2">
                        <div className="button login-button" onClick={() => window.location.href = '/login/google'}>
                            Login with <FontAwesomeIcon icon={faGoogle} size='lg' />
                        </div>
                        <div className="button login-button" onClick={() => window.location.href = '/reset-password'}>Forgot password?</div>
                        <div className="button login-button" onClick={() => window.location.href = '/'}><FontAwesomeIcon icon={faHome} size='lg' /></div>
                    </div>
                </div>
            </div>
        :
    <Loading />
    );
};

export default LoginPage;