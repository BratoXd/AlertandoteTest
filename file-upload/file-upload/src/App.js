import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Logger from './components/logger';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Revisa si el usuario está autenticado en el backend (puedes ajustar según tu lógica de sesión)
        fetch("http://localhost:4000/auth/status", { credentials: 'include' })
            .then(response => response.json())
            .then(data => setIsAuthenticated(data.isAuthenticated));
    }, []);

    return (
      <FileUpload />
 
    );
}

export default App;
