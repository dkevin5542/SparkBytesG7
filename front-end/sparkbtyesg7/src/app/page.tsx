"use client"; // Using client-side features in Next.js
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

export default function Home() {
  const [events, setEvents] = useState([
    { title: "Event 1", description: "Description 1", date: "2024-12-01", location: "Location 1" },
    { title: "Event 2", description: "Description 2", date: "2024-12-02", location: "Location 2" }
  ]);

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