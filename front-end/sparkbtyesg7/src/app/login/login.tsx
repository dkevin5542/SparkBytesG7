import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
      {children}
    </GoogleOAuthProvider>
  );
};

export const GoogleAuthButton: React.FC = () => {
  return (
    <div className="google-login-button">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
};
