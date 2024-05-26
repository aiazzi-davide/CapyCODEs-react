import React, { useEffect, useState } from 'react';
import { php_url} from '../vars';
import { useParams } from 'react-router-dom';
const NewPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { emailAddr } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        } else {
            fetch(php_url + '/new-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    password: password,
                    email: emailAddr
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    setIsLoaded(true);
                    if (data.status == 200) {
                        window.location.href = '/login';
                    } else {
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                });
        }
    };

    return {isLoaded} ? (
        <div>
            <h1>New Password Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">New Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    id="confirmPassword" placeholder="Confirm Password"
                />
                <button type="submit">Update Password</button>
            </form>
            {error && <div>{error}</div>}
        </div>
    ) : 
        (<div>   
            <h1>Loading...</h1>
        </div>)
};

export default NewPasswordPage;