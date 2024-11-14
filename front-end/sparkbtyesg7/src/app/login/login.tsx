import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation'; 


interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="140220835320-hp2l5648gotpt7u322qks2eaf7k8ggvn.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
};

export const GoogleAuthButton: React.FC = () => {
  const router = useRouter();
  return (
    <div className="google-login-button">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const idToken = credentialResponse.credential;

        fetch('http://localhost:5002/api/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ token: idToken })
        })
          .then(response => response.json())
          .then(data => {
            if (data.message === 'Login successful') {
              console.log('User logged in:', data);
              router.push('/createprofile');
            } else {
              console.log('Login failed:', data.message);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
};

export const isAuthenticated = () => {
  return localStorage.getItem('userToken') !== null;
};
