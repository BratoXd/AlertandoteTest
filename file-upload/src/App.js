import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Logger from './components/logger';


function App() {
  const [autentificaded, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/auth/status", {
      method: "GET",
      credentials: "include", 
    })
      .then((res) => res.json())  
      .then((data) => {
        console.log(data);  
        setAuthenticated(data.authenticated);  
      })
      .catch((error) => {
        console.error("Error al obtener el estado de autenticación:", error);
      });
  }, []);

  return (
    autentificaded ? ( <FileUpload />) : (<Logger />)
 

  );
}

export default App;
