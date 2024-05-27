import React from 'react';
import '../css/Loading.css';
import ContentLoader from "react-content-loader"

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
        case 'skeleton':
            return(
                <ContentLoader 
                    speed={2}
                    width={206}
                    height={40}
                    viewBox="0 0 206 40"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <rect x="48" y="8" rx="3" ry="3" width="88" height="6" /> 
                </ContentLoader>
            )
        default:
            return (
                <div className='loading'>
                    <span className="loader" />
                </div>
            );
    }
};

export default Loading;