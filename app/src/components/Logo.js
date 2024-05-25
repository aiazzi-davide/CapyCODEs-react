import React from 'react';

const Logo = () => {
    const redirectHome = () => {
        window.location.href = '/';
    };
    return (
        <div className='logo-container' onClick={redirectHome}>
            <h1>CapyCODEs</h1>
            <img className='logo-img' src='capy.png' ></img>
        </div>
    );
};

export default Logo;