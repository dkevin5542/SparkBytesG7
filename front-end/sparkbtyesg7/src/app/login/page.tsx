'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import '@/app/styles/login.css'; // Import global CSS

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();

            // Redirect to the dashboard or any other page upon successful login
            redirect('/dashboard');
        } catch (err: any) {
            setError(err.message);
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
                            className="input"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="button">
                        Login
                    </button>
                </form>
                <p className="register-link">
                    Don’t have an account? <a href="/about">Register here</a>.
                </p>
            </div>
        </div>
    );
}

