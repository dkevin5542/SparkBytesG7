'use client';
/* Importing React and global CSS styles. */
import React from 'react';
import { AuthProvider, GoogleAuthButton } from './login';
import '@/app/styles/login.css'; 

/**
 * LoginPage Component
 *
 * Displays the login page for the application, allowing users to authenticate using Google OAuth.
 * 
 * Purpose:
 * - Serves as the entry point for user authentication.
 * - Wraps the page with the 'AuthProvider' to enable Google OAuth functionality.
 * - Provides a Google login button for users to sign in.
 * 
 * Features:
 * - Uses the 'AuthProvider' to integrate Google OAuth into the application.
 * - Displays a welcoming message and a prompt to sign in.
 * - Includes the 'GoogleAuthButton' for Google authentication.
 * 
 * Components:
 * - 'AuthProvider': Wraps the page and enables Google OAuth functionality.
 * - 'GoogleAuthButton': Displays a Google login button and handles authentication logic.
 * 
 * Usage:
 * - Used as the login page for the application.
 * - Requires integration with the 'AuthProvider' and backend authentication endpoints.
 * 
 * Styling:
 * - Custom styles are imported from 'login.css' for layout and design.
 */

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