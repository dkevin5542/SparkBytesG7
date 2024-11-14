"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventList from "./components/eventlist";
import '@/app/styles/page.css';
import { isAuthenticated } from './login/login';
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
export default function Home() {
  const [events, setEvents] = useState([
    { title: "Event 1", description: "Description 1", date: "2024-12-01", location: "Location 1" },
    { title: "Event 2", description: "Description 2", date: "2024-12-02", location: "Location 2" }
  ]);

  //comment out line 36-42 if you want to test without logging in everytime
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, []);

  return (
    <div className="home-page">
      <div className="content">
        <EventList events={events} />
      </div>
    </div>
  );
}

//backend testing to see if newly created events will display 
// export default function Home() {
//   const [events, setEvents] = useState([]);
//   const router = useRouter();

//   // Fetch events from the backend
//   const fetchEvents = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/events');
//       if (response.ok) {
//         const data = await response.json();
//         setEvents(data.events || []); // Assume API returns an array of events under 'events' key
//       } else {
//         console.error('Failed to fetch events');
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.push('/login'); // Redirect to login if not authenticated
//     } else {
//       fetchEvents(); // Fetch events on component mount
//     }
//   }, []);

//   return (
//     <div className="home-page">
//       <div className="content">
//         <h1>Newly Created Events</h1>
        
//         {/* Event List */}
//         <EventList events={events} />
//       </div>
//     </div>
//   );
// }