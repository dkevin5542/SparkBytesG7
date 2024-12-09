"use client";
/* Importing React and global CSS styles. */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventList from "./components/eventlist";
import '@/app/styles/page.css';
import { isAuthenticated } from './login/login';

/**
 * Home Component
 *
 * The main page of the SparkBytes application.
 *
 * Purpose:
 * - Displays a list of upcoming events fetched from the backend.
 *
 * Features:
 * - Fetches event data from the backend API upon component mount.
 * - Handles loading and error states during data fetching.
 * - Redirects to login page if the user is not authenticated.
 * - Displays a fallback message if no events are available.
 *
 * State:
 * - 'events': An array of event objects, each containing 'title', 'description', 'date', and 'location'.
 * - 'loading': A boolean indicating whether the data is still being fetched.
 * - 'error': A string that stores an error message if data fetching fails.
 * - 'isGoogleAuthenticated': A boolean indicating whether the user is authenticated with Google.
 *
 * Styling:
 * - Uses 'page.css' for layout and design.
 */

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Allow error to be a string or null
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false); // Track Google authentication
  const router = useRouter();

  // Check if user is authenticated, if not redirect to login page
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push('/login');
      } else {
        // Assume Google authentication is part of the `isAuthenticated` logic
        setIsGoogleAuthenticated(true);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/getevents');
      if (response.ok) {
        const data = await response.json();
        console.log('Events fetched:', data);
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
    if (isGoogleAuthenticated) {
      fetchEvents();
    }
  }, [isGoogleAuthenticated]);

  if (loading) {
    return <div className="home-page"><p>Loading events...</p></div>;
  }

  if (error) {
    return <div className="home-page"><p>{error}</p></div>;
  }

  if (!isGoogleAuthenticated) {
    return <div className="home-page"><p>Checking authentication...</p></div>;
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