import { useState, useEffect } from 'react';
import { php_url, react_url } from '../vars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

function Login(props) {
  
  const [data, setData] = useState(null);

  const logout = () => {
    fetch(php_url + '/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setData(data);
        window.location.href = react_url;
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  let response;
  //console.log(props);

  if (props['profile']) {
    console.log(props);
    response = (
      <div className='login'>
        <b>{props['profile'].Username}</b>
        <FontAwesomeIcon icon={faRightFromBracket} size='lg' onClick={logout}/>
        {props['admin'] && <button onClick={() => window.location.href = react_url + '/admin'}>Admin</button>}
      </div>
    );

    console.log('loggato');
  } else {
    response = (
      <div>
        <button onClick={() => window.location.href = react_url + '/login'}>Login</button>
      </div>
    );

    console.log('non loggato');
  }
  return response;
}

export default Login;