import React from 'react';

const ServerErrorPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '48px', color: 'red' }}>500 Server Error</h1>
            <p tyle={{ fontSize: '24px' }}>Sorry, something went wrong on the server.</p>
        </div>
    );
};

export default ServerErrorPage;