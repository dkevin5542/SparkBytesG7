"use client";
import React, { useState } from 'react';
import Navbar from "./components/navbar";
import CreateEventForm from "./components/eventform";
import EventList from "./components/eventlist";
import '@/app/styles/page.css';

export default function Home() {
  const [events, setEvents] = useState([]);

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  return (
    <div className="home-page">
      <Navbar />
      <div className="content">
        <CreateEventForm onCreate={handleCreateEvent} />
        <EventList events={events} />
      </div>
    </div>
  );
}