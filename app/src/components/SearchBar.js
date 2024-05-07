import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        // redirect to search results page
        window.location.href = `/search?q=${searchTerm}`;
        
    };

    return (
        <div>
            <input
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        handleSearch();
                    }
                }}
                className='input-search'
                type="text"
                placeholder="Search for games..."
                value={searchTerm}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default SearchBar;