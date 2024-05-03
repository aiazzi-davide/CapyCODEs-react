import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        // Implement your search logic here
        console.log('Searching for:', searchTerm);
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