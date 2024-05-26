import React, { useState } from 'react';
import { php_url} from '../vars';
import '../css/App.css';
import { useEffect } from 'react';
import Loading from '../components/Loading';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [emailSent, setEmailSent] = useState(0); // 0 = not sent, 200 = sent, 401 = not found
    const [error, setError] = useState(null);
    const [cooldown, setCooldown] = useState(false);
    const [data, setData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

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
                    window.location.href = ('/new-password/' + email);
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
                if (data.status == 200) {
                    setCooldown(true);
                    setTimeout(() => {
                        setCooldown(false);
                    }, 60000);
                }
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
        
    }

    function loadProfile() {
        fetch(php_url + '/profile', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setData(data);
                setIsLoaded(true);
                setEmail(data.Email);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <div className='cdiv'>
            <h1>Forgot password?</h1> <br />
            <form>
                {
                    isLoaded ?
                    <input
                        placeholder="Email or Username"
                        type="email"
                        value={data.Email ? data.Email : email}
                        onChange={(e) => setEmail(e.target.value)}
                    /> :
                        <Loading type={'wm'} />
                }
                <button onClick={sendCode} disabled={cooldown}>
                    {emailSent == 200 ? <span>resend code</span> : <span>send code</span>}
                </button>
                {cooldown ? <p className='error'>Please wait 60 seconds before resending</p> : null}
                <br />
                {emailSent == 200 ? <p className='success'>Email sent</p> : null}
                {emailSent == 401 ? <p className='error'>Email not found</p> : null}
                <br />

                <input placeholder='OTP Code' type='text' value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button onClick={handleResetPassword}>Change password</button>
                <br />
                {error ? <p className='error'>{error}</p> : null}
            </form>
        </div>
    );
};

export default ResetPasswordPage;