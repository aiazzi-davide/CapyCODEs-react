import { useState, useEffect } from 'react';
import { php_url } from '../vars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importa FontAwesomeIcon
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import Loading from './Loading';

function Login(props) {

  const redirectProfile = () => {
    window.location.href = '/profile';
  };

  const logout = () => {
    fetch(php_url + '/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        window.location.href = '/'
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  let response;
  //console.log(props);
  if (props['isLoaded']) {
    if (props['profile']) {
      console.log(props);
      response = (
        <div className='profile' >
          <div className='name button' onClick={redirectProfile}>{props['profile'].Username} </div>
          <div className='logout button'>
            <FontAwesomeIcon icon={faRightFromBracket} size='lg' onClick={logout} />
          </div>
          {props['admin'] && <div className='admin-button button' onClick={() => window.location.href = '/admin'}>Admin</div>}
        </div>
      );

      console.log('loggato');
    } else {
      response = (
        <div className='profile'>
          <div className='login-button button' onClick={() => window.location.href = '/login'}>
            Login <FontAwesomeIcon icon={faGoogle} size='lg' />
          </div>
        </div>
      );

      console.log('non loggato');
    }
    return response;
  } else {
    return (
      <div>
        <Loading type={'wm'}/>
      </div>
    );
  }
}

export default Login;