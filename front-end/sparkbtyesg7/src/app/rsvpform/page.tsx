'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RSVPFormProps {
  eventId: number; 
}

const RSVPForm: React.FC<RSVPFormProps> = ({ eventId }) => {
  const router = useRouter();
  const [rsvpStatus, setRsvpStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!rsvpStatus) {
      setErrorMessage('Please select an RSVP status.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          event_id: eventId,
          rsvp_status: rsvpStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to RSVP.');
      }

      const data = await response.json();
      setSuccessMessage(data.message || 'RSVP successful!');
      setTimeout(() => {
        router.push('/events'); // Redirect to the events page or dashboard
      }, 2000);
    } catch (error: any) {
      console.error('Error during RSVP:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>RSVP for Event #{eventId}</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          RSVP Status:
          <select
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value)}
            required
            style={{
              display: 'block',
              width: '100%',
              marginTop: '5px',
              padding: '10px',
              fontSize: '16px',
            }}
          >
            <option value="">Select an option</option>
            <option value="Going">Going</option>
            <option value="Interested">Interested</option>
            <option value="Not Going">Not Going</option>
          </select>
        </label>
        <button
          type="submit"
          style={{
            marginTop: '20px',
            padding: '10px 15px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  );
};

export default RSVPForm;
