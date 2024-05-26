import { useState, useEffect} from 'react';
import { php_url, checkLogin } from "../vars";
import '../css/RegisterPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Logo from "../components/Logo";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleSurnameChange = (e) => {
        setSurname(e.target.value);
    }   

    const handleBirthdateChange = (e) => {
        setBirthdate(e.target.value);
    }

    const passwordMatch = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        } else {
            return true;
        }
    }

    const redirectLogin = () => {
        window.location.href = '/login';
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwordMatch()) {
            fetch(php_url + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    username: username,
                    nome: name,
                    cognome: surname,
                    data_nascita: birthdate,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    data.status == 200 ? window.location.href = `/verify/${email}` : setError(data.message);
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                });
        }
    };

    useEffect(() => {
        //setTimeout(() => {
            checkLogin(setIsLoaded);
        //}, 1000);
    }, []);

    return (
        <div className="pink-page">
            <div className="login-form">
                <h1>SignUp to <Logo /></h1>
                <div className="left-container register">
                    <div className="left">
                        <input className="input" type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
                        <input className="input" type="text" value={username} onChange={handleUsernameChange} placeholder="Username" />
                        <input className="input" type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
                        <input className="input" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" />
                    </div>
                    <div className="right">
                        <input className="input" type="text" value={name} onChange={handleNameChange} placeholder="Name" />
                        <input className="input" type="text" value={surname} onChange={handleSurnameChange} placeholder="Surname" />
                        <input className="input" type="date" value={birthdate} onChange={handleBirthdateChange} placeholder="Birthdate" />
                        <div className="buttons">
                            <div className="button" onClick={handleSubmit} type="submit">SignUp</div>
                            <div className="button login-button" onClick={() => window.location.href = '/login/google'}>
                                Login with <FontAwesomeIcon icon={faGoogle} size='lg' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="foot">
                    {error && <div className="error">{error} {error == 'Email already in use' && <a href="/login">Login</a>} </div>}
                </div>
            </div>
        </div>
    );

}

export default RegisterPage;