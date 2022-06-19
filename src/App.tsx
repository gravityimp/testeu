import React, { useState } from 'react';
import { Box } from '@mui/material';
import './App.css';
import NavBar from './components/NavBar';
import AdminPage from './pages/AdminPage';
import GeneralPage from './pages/GeneralPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Route, Routes, Navigate } from "react-router-dom"
import { TokenRounded, TokenSharp } from '@mui/icons-material';

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token'));

  const checkLoggedIn = () => {
    if (!token) {
      return false;
    }
    return true;  
  }

  return (
    <>
      {checkLoggedIn() && <NavBar setToken={setToken} />}

      {
        checkLoggedIn()
          ? (
            <Routes>
              <Route path="/" element={<GeneralPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<GeneralPage />} />
            </Routes>
          )
          : (
            <Routes>
              <Route path="/register" element={<RegisterPage setToken={setToken} />} />
              <Route path="/login" element={<LoginPage setToken={setToken} />} />
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
          )
      }
    </>
  )
}

export default App;