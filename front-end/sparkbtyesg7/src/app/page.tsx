"use client";
import React, { useEffect, useState } from 'react';
import EventList from "./components/eventlist";
import '@/app/styles/page.css';

/**
 * Home Component
 *
 * The main page of the SparkBytes application.
 *
 * Purpose:
 * - Displays a list of upcoming events fetched from the backend.
 * - Uses the 'EventList' component to display event details.
 *
 * Features:
 * - Fetches event data from the backend API upon component mount.
 * - Handles loading and error states during data fetching.
 * - Displays a fallback message if no events are available.
 *
 * State:
 * - 'events': An array of event objects, each containing 'title', 'description', 'date', and 'location'.
 * - 'loading': A boolean indicating whether the data is still being fetched.
 * - 'error': A string that stores an error message if data fetching fails.
 *
 * Usage:
 * - Serves as the default page, providing users with an overview of current events.
 *
 * Styling:
 * - Uses 'page.css' for layout and design.
 */


// Backend testing to see if newly created events will display
export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Allow error to be a string or null

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/events');
      if (response.ok) {
        const data = await response.json();
        console.log('here', data);
        setEvents(data.events); 
      } else {
        console.error('Failed to fetch events');
        setError('Failed to fetch events'); 
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error fetching events'); 
    } finally {
      setLoading(false); 
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
    console.log(events);
  }, []);

  if (loading) {
    return <div className="home-page"><p>Loading events...</p></div>;
  }

  if (error) {
    return <div className="home-page"><p>{error}</p></div>;
  }

  return (
    <div className="home-page">
      <div className="content">
        <h1>All Events</h1>
        {events.length > 0 ? (
          <EventList events={events} />
        ) : (
          <p>No events available. Check back later!</p>
        )}
      </div>
    </div>
  );
}