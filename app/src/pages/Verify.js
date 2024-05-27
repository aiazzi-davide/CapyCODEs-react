import React, { useState, useEffect } from 'react';
import { php_url, checkLogin } from '../vars';
import { useParams } from 'react-router-dom';

function Verify() {
    const { emailAddr } = useParams();
    const [email, setEmail] = useState(emailAddr);
    const [otp, setOtp] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your verification logic here
        console.log('Email:', email);
        console.log('OTP:', otp);
        
        fetch(php_url + '/verify',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                if (data.status == 200) {
                    alert('Verification successful');
                    window.location.href = '/login';
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    useEffect(() => {
            checkLogin(setIsLoaded);
    }, []);

    return (
        <div>
            <h1>Verify</h1>
            <div >
                <div className='left-container'>
                    OTP:
                    <input className='input' type="text" value={otp} onChange={handleOtpChange} />
                <div className='button' onClick={handleSubmit}>Verify</div>
                </div>
            </div>
        </div>
    );
}

export default Verify;