"use client";
import React, { useState } from 'react';
import Navbar from "../components/navbar";
import CreateEventForm from "../components/eventform";
import '@/app/styles/page.css';

export default function CreateEventPage() {
  const [events, setEvents] = useState([]);

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
    console.log("Event Created: ", newEvent);
  };

  return (
    <div className="create-event-page">
      <Navbar />
      <div className="content">
        <CreateEventForm onCreate={handleCreateEvent} />
      </div>
    </div>
  );
}