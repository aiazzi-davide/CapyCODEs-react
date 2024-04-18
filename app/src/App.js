import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Login data={data.profile} />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
