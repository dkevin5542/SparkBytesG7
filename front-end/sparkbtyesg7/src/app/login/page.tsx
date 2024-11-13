'use client';
import React from 'react';
import { AuthProvider, GoogleAuthButton } from './login';
import '@/app/styles/login.css'; 

const LoginPage: React.FC = () => {
  return (
    <AuthProvider>
      <div className="login-page-container">
        <div className="login-page">
          <h1>Welcome to Our App</h1>
          <p>Sign in to continue</p>
          <GoogleAuthButton />
        </div>
      </div>
    </AuthProvider>
  );
};

export default LoginPage;

