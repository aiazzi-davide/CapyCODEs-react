import React, { useState } from 'react';

const SearchBar = (props) => {

    const handleInputChange = (event) => {
        setTimeout(() => {
            props.setQuery(event.target.value);
        }, 1000);
    };

    return (
        <div>
            <input
                onChange={handleInputChange}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        handleInputChange(event);
                    }
                }}
                className='input-search'
                type="text"
                placeholder="Search for games..."
                id = "search-bar"
            />
        </div>
    );
};

export default SearchBar;