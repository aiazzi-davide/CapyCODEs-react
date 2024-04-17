import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Header from './Header'
import Footer from './Footer'
import Login from './Login'

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('http://localhost:81/', {
      method: 'GET',
      credentials: 'include' // Include cookies
    })
      .then(response => response.json())
      .then(data => {
        setData(data);
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <>
      <Header />
      <Login data={data.profile} />
      <Footer />
    </>
  );
}

export default App;
