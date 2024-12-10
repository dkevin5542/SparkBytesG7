'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RSVPEvent {
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  address: string;
  quantity: number;
  status: string;
}

const UserRSVPsPage: React.FC = () => {
  const [rsvpEvents, setRsvpEvents] = useState<RSVPEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUserRSVPs = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:5002/api/user_rsvps', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch RSVP events.');
      }

      const data = await response.json();
      if (data.success) {
        setRsvpEvents(data.events);
      } else {
        throw new Error(data.message || 'No RSVP events found.');
      }
    } catch (error: any) {
      console.error('Error fetching RSVP events:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRSVPs();
  }, []);

  if (loading) {
    return <div>Loading your RSVP events...</div>;
  }

  if (errorMessage) {
    return (
      <div>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <button onClick={fetchUserRSVPs}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your RSVP Events</h1>
      {rsvpEvents.length === 0 ? (
        <p>You have not RSVP’d to any events yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rsvpEvents.map((event) => (
            <li
              key={event.event_id}
              style={{
                borderBottom: '1px solid #ddd',
                marginBottom: '15px',
                paddingBottom: '15px',
              }}
            >
              <h2 style={{ margin: '0 0 5px' }}>{event.title}</h2>
              <p style={{ margin: '0' }}>{event.description}</p>
              <p style={{ margin: '0' }}>
                <strong>Date:</strong> {event.event_date}
              </p>
              <p style={{ margin: '0' }}>
                <strong>Time:</strong> {event.start_time} - {event.end_time}
              </p>
              <p style={{ margin: '0' }}>
                <strong>Location:</strong> {event.location}, {event.address}
              </p>
              <p style={{ margin: '0' }}>
                <strong>Status:</strong> {event.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRSVPsPage;
