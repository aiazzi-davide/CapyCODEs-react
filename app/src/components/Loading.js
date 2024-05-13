import React from 'react';
import '../css/Loading.css';

const Loading = ({ type }) => {
    switch (type) {
        case 'spinner':
            return (
                <div className='loading'>
                    <span className="loader" />
                </div>
            );
        case 'wm':
            return (
                <div className='wm' />
            );
        case 'ic':
            return (
                <div className='loading'>
                    <div className='ic' />
                </div>
            );
        case 'fp':
            return (
                <div className='loading'>
                    <div className='fp' />
                </div>
            );
        default:
            return (
                <div className='loading'>
                    <span className="loader" />
                </div>
            );
    }
};

export default Loading;