import { useState, useEffect } from 'react';
import { php_url } from '../vars';

function Login(props) {
  
  const [data, setData] = useState(null);

  const logout = () => {
    fetch(php_url + '/logout', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setData(data);
        window.location.href = 'http://localhost:3000/';
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  let response;
  //console.log(props);

  if (props['profile']) {
    response = (
      <div className='login'>
        <h1>Welcome, {props['profile'].Username}!</h1>
        <p>Your email is {props['profile'].Email}.</p>
        <button onClick={logout}>Logout</button>
      </div>
    );

    console.log('loggato');
  } else {
    response = (
      <div>
        <h1>Welcome!</h1>
        <p>Please log in to view your profile.</p>
        <button onClick={() => window.location.href = 'http://localhost:3000/login'}>Log in</button>
      </div>
    );

    console.log('non loggato');
  }
  return response;
}

export default Login;