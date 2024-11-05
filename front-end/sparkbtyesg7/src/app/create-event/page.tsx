"use client";
import React, { useState } from 'react';
import CreateEventForm from "../components/eventform";
import '@/app/styles/page.css';

interface Event {
  title: string;
  date: string;
  location: string;
}

export default function CreateEventPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    console.log("Event Created: ", newEvent);
  };

  return (
    <div className="create-event-page">
      <div className="content">
        <CreateEventForm onCreate={handleCreateEvent} />
      </div>
    </div>
  );
}