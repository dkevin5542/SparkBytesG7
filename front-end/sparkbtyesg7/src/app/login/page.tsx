'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app router
import '@/app/styles/login.css'; // Import global CSS

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Initialize the router


    //new logic, haven't tested
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Step 1: Authenticate the user
            const response = await fetch('http://localhost:5002/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Include cookies for authentication
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Invalid credentials');
            }
    
            // Step 2: Check if the user has a profile
            const profileResponse = await fetch('http://localhost:5002/auth/profile_status', {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });
    
            if (!profileResponse.ok) {
                console.error('Error fetching profile_complete status:', profileResponse.status);
                throw new Error('Failed to check profile status');
            }
    
            const profileData = await profileResponse.json();
            console.log('Profile Data:', profileData);
    
            // Step 3: Redirect based on the profile existence
            if (profileData.profile_complete) {
                router.push('/'); // Redirect to home if profile exists
            } else {
                console.error('Redirecting to create profile:', profileData.message);
                router.push('/createprofile'); // Redirect to create-profile if profile does not exist
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         // Step 1: Authenticate the user
    //         const response = await fetch('http://localhost:5002/auth/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email, password }),
    //             credentials: 'include', // Include cookies for authentication
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Invalid credentials');
    //         }

    //         // Step 2: Check if the user has a profile
    //         const profileResponse = await fetch('http://localhost:5002/auth/profile_status', {
    //             method: 'GET',
    //             credentials: 'include', // Include cookies in the request
    //         });

    //         if (!profileResponse.ok) {
    //             console.error('Error fetching profile_complete status:', profileResponse.status);
    //             throw new Error('Failed to check profile status');
    //         }

    //         const profileData = await profileResponse.json();

    //         // Step 3: Redirect based on the profile existence
    //         if (profileData.has_profile) {
    //             router.push('/'); // Redirect to home if profile exists
    //         } else {
    //             router.push('/createprofile'); // Redirect to create-profile if profile does not exist
    //         }
    //     } catch (err: any) {
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };





    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Login</h1>
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-group">
                        <label htmlFor="email" className="label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="johndoe@bu.edu"
                            className="input"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            className="input"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="register-link">
                    Don’t have an account? <a href="/register">Register here</a>.
                </p>
            </div>
        </div>
    );
}




