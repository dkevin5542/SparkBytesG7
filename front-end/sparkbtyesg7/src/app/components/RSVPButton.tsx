import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/styles/rsvp-button.css';


interface RSVPButtonProps {
  eventId: number;
}

const RSVPButton: React.FC<RSVPButtonProps> = ({ eventId }) => {
  const router = useRouter();
  const [rsvpStatus, setRsvpStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRSVP = async () => {
    if (!rsvpStatus) {
      setErrorMessage('Please select an RSVP status.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5002/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
        router.push('/events');
      }, 2000);
    } catch (error: any) {
      console.error('RSVP error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <div className="rsvp-buttons">
        <label>
          <strong>RSVP:</strong>
          <select
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '5px',
              fontSize: '14px',
            }}
            disabled={loading}
          >
            <option value="">Select</option>
            <option value="Going">Going</option>
            <option value="Interested">Interested</option>
            <option value="Not Going">Not Going</option>
          </select>
        </label>
        <button
          onClick={handleRSVP}
          style={{
            marginLeft: '10px',
            padding: '10px 15px',
            fontSize: '14px',
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
      </div>
    </div>
  );
};

export default RSVPButton;
