import { UseEffect, useState } from 'react';
import {php_url, react_url, checkLogin} from '../vars';
function GoogleLogin() {
    fetch(php_url + '/login/google', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            window.location.replace(data.url);
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
}

export default GoogleLogin;