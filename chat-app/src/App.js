import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Main from './components/Leftbar';
import Navbar from './components/Navbar';

function App({ isAuthenticated, setIsAuthenticated, userid, setUserid}) {
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Main userid ={userid} setUserid={setUserid} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
    </>
  );
}

export default App;