"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventList from "./components/eventlist";
import '@/app/styles/page.css';

/**
 * Home Component
 *
 * The main page of the SparkBytes application.
 *
 * Purpose:
 * - Displays a list of upcoming events fetched from the backend.
 * - Redirects to login page if the user is not authenticated.
 * - Displays a fallback message if no events are available.
 */

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to check if the user is authenticated
  const isAuthenticated = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5002/auth/isAuthenticated', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
        return data.authenticated; // Assume the API returns a boolean `authenticated` field
      } else {
        console.error('Authentication check failed:', response.status);
        return false;
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      return false;
    }
  };

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [router]);

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/getevents', {
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
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

