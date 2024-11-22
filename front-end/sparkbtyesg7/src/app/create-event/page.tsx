"use client"; // Using client-side features in Next.js
import React, { useState } from 'react';
import CreateEventForm from "../components/eventform";
import '@/app/styles/formpage.css';

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

interface Event {
  title: string;
  description: string;
  date: string;
  event_id: number | "";
  location: string;
  food_type: string[];
  address: string;
  start_time: string;
  end_time: string;
  quantity: number | "";
  event_type?: string;
}

export default function CreateEventPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateEvent = async (newEvent: Event) => {
    try {
      const response = await fetch('http://127.0.0.1:5002/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });

      if (response.ok) {
        setMessage(`Event "${newEvent.title}" created successfully!`);
        console.log("Event Created: ", newEvent);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="create-event-page">
      <div className="content">
        <h1>Create an Event</h1>
        
        {/* Feedback Message */}
        {message && <div className="feedback-message">{message}</div>}
        
        {/* Event Creation Form */}
        <CreateEventForm onCreate={handleCreateEvent} />
      </div>
    </div>
  );
}