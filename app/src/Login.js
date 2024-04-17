interface LoginProps {
  username: string;
}

function Login(props: LoginProps) {
  const username = props.username;

  if (username) {
    return <div>Logged in as {username}</div>;
  } else {
    return (
      <div>
      <button onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    );
  }
}

export default Login;