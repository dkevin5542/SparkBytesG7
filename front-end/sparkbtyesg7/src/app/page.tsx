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
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated and redirect if not

  const checkAuth = async () => {
    try {
      const authenticated = await fetch('http://localhost:5002/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (!authenticated.ok) {
        console.error('User not authenticated, redirecting to login');
        router.push('/login'); // Redirect to login if not authenticated
      }
    } catch (err) {
      console.error("Error during authentication check:", err);
      setError("Failed to verify authentication");
    } finally {
      setLoadingAuth(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch("http://localhost:5002/api/getevents", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoadingEvents(false);
    }
  };

  // Run authentication check on component mount
  useEffect(() => {
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!loadingAuth && !error) {
      fetchEvents();
    }
  }, [loadingAuth, error]);

  if (loadingAuth) {
    return <div className="home-page"><p>Verifying authentication...</p></div>;
  }

  if (loadingEvents) {
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

