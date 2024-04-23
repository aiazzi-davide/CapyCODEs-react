import React, { useState } from 'react';
import { php_url, react_url, checkLogin } from '../vars';
import '../css/App.css';
import Lottie from 'react-lottie';
const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [emailSent, setEmailSent] = useState(0); // 0 = not sent, 200 = sent, 401 = not found
    const [error, setError] = useState(null);

    const handleResetPassword = (e) => {
        e.preventDefault();
        fetch(php_url + '/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                otp: otp
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                if (data.status == 200) {
                    window.location.replace(react_url + '/new-password');
                } else {
                    setError(data.message);
                }
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const sendCode = (e) => {
        e.preventDefault();
        fetch(php_url + '/send-otp', {
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
                setEmailSent(data.status);        
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
        
    }

    return (
        <div className='cdiv'>
            <h1>Forgot password?</h1> <br />
            <form>
                <input
                    placeholder="Email or Username"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={sendCode}>{emailSent == 200 ? <span>resend code</span> : <span>send code</span>}</button>
                <br />
                {emailSent == 200 ? <p className='success'>Email sent</p> : null}
                {emailSent == 401 ? <p className='error'>Email not found</p> : null}
                <br />

                <input placeholder='OTP Code' type='text' value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button onClick={handleResetPassword}>send</button>
                <br />
                {error ? <p className='error'>{error}</p> : null}
            </form>
        </div>
    );
};

export default ResetPasswordPage;