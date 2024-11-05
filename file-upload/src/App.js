import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Logger from './components/logger';

function App() {
 
    return (
      <FileUpload />
 
    );
}

export default App;
