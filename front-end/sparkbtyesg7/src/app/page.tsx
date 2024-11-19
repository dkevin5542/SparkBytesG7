"use client";

import React from 'react';
import Link from 'next/link';

/**
 * HomePage Component
 *
 * The homepage of the SparkBytes application.
 * Uses client-side rendering to provide an interactive user experience.
 *
 * Purpose:
 * - Displays a welcoming message and brief description of SparkBytes.
 * - Provides a navigation link to the Events page.
 *
 * Features:
 * - Renders a heading and description introducing SparkBytes.
 * - Includes a Link component for client-side navigation to the Events page.
 */


export default function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to SparkBytes</h1>
      <p>Find and share events with free food!</p>
      <Link href="/events">
        <a>Check out our events</a> {/* Link to the Events page */}
      </Link>
    </div>
  );
}

/*"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventList from "./components/eventlist";
import '@/app/styles/page.css';
import { isAuthenticated } from './login/login';*/
/**
 * Home Component
 *
 * The main page of the Spark Bytes application.
 *
 * Purpose:
 * - Displays a list of upcoming events.
 * - Uses the 'EventList' component to display event details.
 *
 * Features:
 * Passes the event data to 'EventList' for display.
 *
 * State:
 * 'events': A list of event objects, each contains a 'title', 'description', 'date', and 'location'.
 *
 * Usage:
 * Serves as the default page, providing users with an overview of current events.
 *
 * Styling:
 * Uses 'page.css' for layout and design.
 */

//placeholder for home page
// export default function Home() {
//   const [events, setEvents] = useState([
//     { title: "Event 1", description: "Description 1", date: "2024-12-01", location: "Location 1" },
//     { title: "Event 2", description: "Description 2", date: "2024-12-02", location: "Location 2" }
//   ]);

  //comment out line 36-42 if you want to test without logging in everytime
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     router.push('/login'); // Redirect to login if not authenticated
  //   }
  // }, []);

//   return (
//     <div className="home-page">
//       <div className="content">
//         <EventList events={events} />
//       </div>
//     </div>
//   );
// }

//backend testing to see if newly created events will display
/*
export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); */

  //comment out line 36-42 if you want to test without logging in everytime
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     router.push('/login'); // Redirect to login if not authenticated
  //   }
  // }, []);

  // Fetch events from the backend
  /*
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/events');
      if (response.ok) {
        const data = await response.json();
        console.log('here', data);
        setEvents(data.events); // Set the fetched events
      } else {
        console.error('Failed to fetch events');
        setError('Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error fetching events');
    } finally {
      setLoading(false); // Stop loading spinner
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
}*/