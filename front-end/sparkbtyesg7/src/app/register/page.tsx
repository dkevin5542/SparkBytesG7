'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/register.css'; // Import global CSS

export default function Register() {
    const [name, setName] = useState('');
    const [buid, setBuid] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, buid, email, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            setSuccess(true);
            setError(null);
            router.push('/login'); // Redirect to the login page
        } catch (err: any) {
            setError(err.message);
            setSuccess(false);
        }
    };

    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Register</h1>
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-group">
                        <label htmlFor="name" className="label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="buid" className="label">BU ID:</label>
                        <input
                            type="text"
                            id="buid"
                            value={buid}
                            onChange={(e) => setBuid(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
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
                    {success && <p className="success">Registration successful!</p>}
                    <button type="submit" className="button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
