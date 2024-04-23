export const php_url = 'http://localhost:81';
export const react_url = 'http://localhost:3000';

export const checkLogin = (setIsLoaded) => {
    fetch(php_url + '/login', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((data) => {
            
            setIsLoaded(true);
            console.log('Success:', data);
            data.message === 'User already logged in' && window.location.replace(react_url + '/');
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
};