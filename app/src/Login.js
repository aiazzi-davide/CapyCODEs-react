
function Login(profile) {
  const logout = () => {
    fetch('http://localhost:81/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        window.location.href = 'http://localhost:81/';
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };
  let response;
  if (profile['data']) {
    response = (
      <div>
        <h1>Welcome, {profile['data'].Username}!</h1>
        <p>Your email is {profile['data'].Email}.</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  } else {
    response = (
      <div>
        <h1>Welcome!</h1>
        <p>Please log in to view your profile.</p>
        <button onClick={() => window.location.href = 'http://localhost:81/login'}>Log in</button>
      </div>
    );
  }
  return response;
}

export default Login;