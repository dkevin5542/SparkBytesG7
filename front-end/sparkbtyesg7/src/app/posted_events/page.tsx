'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/postedEvents.css';

export default function PostedEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialize the router

    // Fetch user's posted events using the new /api/user_events query
    const fetchUserEvents = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/user_events', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user events');
            }

            const data = await response.json();
            if (data.success) {
                setEvents(data.events); // Set the fetched events
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserEvents();
    }, []);

    if (loading) {
        return <div className="posted-events-page">Loading your events...</div>;
    }

    if (error) {
        return <div className="posted-events-page">Error: {error}</div>;
    }

    return (
        <div className="posted-events-page">
            <h1>Your Posted Events</h1>
            {events.length > 0 ? (
                <ul className="events-list">
                    {events.map((event: any) => (
                        <li key={event.event_id} className="event-item">
                            <h2>{event.title}</h2>
                            <p>{event.description}</p>
                            <p>
                                <strong>Date:</strong> {event.event_date}
                            </p>
                            <p>
                                <strong>Time:</strong> {event.start_time} - {event.end_time}
                            </p>
                            <p>
                                <strong>Location:</strong> {event.location}, {event.address}
                            </p>
                            <p>
                                <strong>Quantity:</strong> {event.quantity}
                            </p>
                            <p>
                                <strong>Dietary Needs:</strong>{' '}
                                {event.dietary_needs.join(', ') || 'None'}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven't posted any events yet.</p>
            )}
        </div>
    );
}

