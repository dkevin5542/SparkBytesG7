import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

// AuthProvider Component
// Wraps the app with GoogleOAuthProvider to provide Google OAuth functionality
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

// Function to check if the user is authenticated
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

// GoogleAuthButton Component
export const GoogleAuthButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [authError, setAuthError] = useState<string | null>(null); // Track login error
  const router = useRouter();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        console.log('User already authenticated');
        router.push('/createprofile'); // Redirect to profile creation if already logged in
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      // Redirect to the create profile page if login is successful
      router.push('/createprofile');
    }
  }, [isLoggedIn, router]);

  const handleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      console.error('No token received');
      setAuthError('No token received');
      return;
    }

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
        setIsLoggedIn(true); // Update login state
      } else {
        console.error('Login failed:', data.message);
        setAuthError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAuthError('Error during login');
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
    setAuthError('Login Failed');
  };

  return (
    <div className="google-login-button">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
      {/* {authError && <p className="error-message">{authError}</p>} */}
    </div>
  );
};


