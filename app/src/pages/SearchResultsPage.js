import React, { useEffect, useState } from 'react';

const SearchResultsPage = () => {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Function to fetch data from the RAWG API
        const fetchData = () => {
            fetch(`https://api.rawg.io/api/games?search=${query}`)
            .then(response => response.json())
            .then(data => setResults(data.results))
            .catch(error => console.error('Error fetching data:', error));
        };

        // Get the query string from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const queryString = urlParams.get('query');
        setQuery(queryString);

        // Fetch data from the RAWG API
        fetchData();
    }, []);

    return (
        <div>
            <h1>Search Results</h1>
            <p>Showing results for: {query}</p>
            <ul>
                {results.map((result) => (
                    <li key={result.id}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResultsPage;