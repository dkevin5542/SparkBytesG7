"use client"; // Using client-side features in Next.js
import React, { useState } from 'react';
import EventList from "./components/eventlist";
import '@/app/styles/page.css';

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

  return (
    <div className="home-page">
      <div className="content">
        <EventList events={events} />
      </div>
    </div>
  );
}