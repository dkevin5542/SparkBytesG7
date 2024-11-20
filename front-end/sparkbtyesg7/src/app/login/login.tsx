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

  const handleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await fetch('http://localhost:5002/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
        credentials: 'include', // Include cookies for session handling
      });

      const data = await response.json();

      if (response.ok && data.message === 'Login successful') {
        console.log('User logged in:', data);

        // Redirect to create profile page after successful login
        router.push('/createprofile');
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="google-login-button">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.error('Login Failed');
        }}
      />
    </div>
  );
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5002/api/protected-route', {
      method: 'GET',
      credentials: 'include', // Include cookies for session handling
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Authenticated user:', data);
      return true; // User is authenticated
    } else {
      console.error('User not authenticated');
      return false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
