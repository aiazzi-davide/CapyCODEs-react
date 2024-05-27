import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../css/Pager.css';

const Pager = ({page, setPage}) => {
    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };
    console.log('page: ', page);

    return (
        <div className='pager'>
            <div className='button' onClick={handlePreviousPage}><FontAwesomeIcon icon={faArrowLeft} /></div>
            <div className='button' onClick={handleNextPage}><FontAwesomeIcon icon={faArrowRight} /></div>
        </div>
    );
};

export default Pager;