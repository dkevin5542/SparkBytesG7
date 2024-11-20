"use client";
import React, { useEffect, useState } from "react";
import EventList from "./components/eventlist";
import "@/app/styles/page.css";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./login/login";

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch events from the backend
  const fetchEvents = async (isMounted: () => boolean) => {
    try {
      const response = await fetch("http://localhost:5002/api/events");
      if (response.ok) {
        const data = await response.json();
        console.log("here", data);
        if (isMounted()) {
          setEvents(data.events);
        }
      } else {
        console.error("Failed to fetch events");
        if (isMounted()) {
          setError("Failed to fetch events");
        }
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      if (isMounted()) {
        setError("Error fetching events");
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true; // Track if the component is mounted
    const isMounted = () => mounted;

    // Authentication logic: Check if the user is authenticated before proceeding
    const checkAuthAndFetchEvents = async () => {
      try {
        const authenticated = await isAuthenticated();

        if (authenticated) {
          // If authenticated, fetch the events
          fetchEvents(isMounted);
        } else {
          // Redirect to login page if not authenticated
          router.push("/login");
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        router.push("/login"); // Redirect to login page if auth check fails
      }
    };

    checkAuthAndFetchEvents();

    // Cleanup function to avoid updating state on unmounted components
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <p>{error}</p>
      </div>
    );
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