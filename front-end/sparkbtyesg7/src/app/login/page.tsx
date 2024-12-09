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

    useEffect(() => {
        // Check if the user's profile is complete
        const checkProfileStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:5002/auth/profile_status', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Error fetching profile status');
                    return;
                }

                const data = await response.json();

                if (data.profile_complete) {
                    // Redirect to the home page if the profile is complete
                    router.push('/');
                }
            } catch (err) {
                console.error('Error checking profile status:', err);
            }
        };

        checkProfileStatus();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5002/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Invalid credentials');
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);

            // Redirect to creating a profile upon successful login
            router.push('/createprofile');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
