import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Header from './Header'
import Footer from './Footer'
import Login from './Login'

function App() {
  const [data, setData] = useState({ Username: '' });

  useEffect(() => {
    fetch('http://localhost:81/', {
      method: 'GET',
      credentials: 'include' // Include cookies
    })
      .then(response => response.json())
      .then(data => {
        setData(data);
        console.log('Success:', data);
        //stampo tipo di variabile
        console.log(data.Username);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <>
      <Header/>
      <Login username={data.Username}/>
      <Footer />
    </>
  );
}

export default App;
