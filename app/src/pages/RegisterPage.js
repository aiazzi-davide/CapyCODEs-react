import { useState } from "react";
import { php_url } from "../vars";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

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
    }

    const passwordMatch = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return false;
        } else {
            return true;
        }
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
                    data.message === 'Registration successful' ? window.location.replace('http://localhost:3000/login') : alert('Registration failed');
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                });
        } else {
            alert('Passwords do not match');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={handleEmailChange} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <label>
                    Confirm Password:
                    <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                </label>
                <label>
                    Username:
                    <input type="text" value={username} onChange={handleUsernameChange} />
                </label>
                <label>
                    Name:
                    <input type="text" value={name} onChange={handleNameChange} />
                </label>
                <label>
                    Surname:
                    <input type="text" value={surname} onChange={handleSurnameChange} />
                </label>
                <label>
                    Birthdate:
                    <input type="date" value={birthdate} onChange={handleBirthdateChange} />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );

}

export default RegisterPage;