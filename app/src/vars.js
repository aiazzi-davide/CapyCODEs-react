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

export const checkAdmin = (setIsLoaded) => {
  fetch(php_url + '/admin', {
      method: 'GET',
      credentials: 'include',
  })
      .then((response) => response.json())
      .then((data) => {
          setIsLoaded(true);
          console.log('Success:', data);
          data.message === 'User is not an admin' && window.location.replace(react_url + '/');
      })
      .catch((error) => {
          console.error('There was an error!', error);
      });
}

export const LoadData = (query, setData, setIsLoaded) => {

    fetch(php_url + "?query=" + query, {
      method: "GET",
      credentials: "include", // Include cookies
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Success:", data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }