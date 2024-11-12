"use client"; // Using client-side features in Next.js
import React, { useState } from 'react';
import CreateEventForm from "../components/eventform";
import '@/app/styles/formpage.css';

interface Event {
  title: string;
  date: string;
  location: string;
}

/**
 * CreateEventPage Component
 *
 * Provides a page for users to create new events.
 * 
 * Purpose:
 * - Displays a form for creating events.
 * - Keeps track of the events users create.
 * - Shows a success message when an event is added.
 *
 * Features
 * - Uses 'CreateEventForm' to handle event input.
 * - Stores a list of events in the component's state.
 * - Automatically clears feedback messages after 3 seconds.
 *
 * State:
 * - 'events': Stores the list of created events.
 * - 'message': Displays a temporary success message after creating an event.
 *
 * Functions:
 * 'handleCreateEvent': Adds a new event to the list and shows a success message.
 *
 * Usage:
 * Included in the application to provide an event creation page.
 *
 * Styling:
 * Uses styles from 'formpage.css'.
 */

export default function CreateEventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    setMessage(`Event "${newEvent.title}" created successfully!`);
    console.log("Event Created: ", newEvent);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="create-event-page">
      <div className="content">
        <h1>Create an Event</h1>
        
        {/* Feedback Message */}
        {message && <div className="feedback-message">{message}</div>}
        
        {/* Event Creation Form */}
        <CreateEventForm onCreate={handleCreateEvent} />

        {/* Event List
        <div className="event-list">
          <h2>Your Events</h2>
          {events.length > 0 ? (
            <ul>
              {events.map((event, index) => (
                <li key={index} className="event-item">
                  <h3>{event.title}</h3>
                  <p>Date: {event.date}</p>
                  <p>Location: {event.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No events created yet. Start by adding a new event!</p>
          )}
        </div> */}
      </div>
    </div>
  );
}