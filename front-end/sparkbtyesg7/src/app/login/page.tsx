'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import '@/app/styles/login.css'; // Import global CSS

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

            // Redirect to the dashboard or any other page upon successful login
            redirect('/createprofile');
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
                            placeholder = "johndoe@bu.edu"
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

