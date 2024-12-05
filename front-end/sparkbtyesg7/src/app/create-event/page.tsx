"use client"; // Using client-side features in Next.js
import React, { useState, useEffect } from "react";
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
  location: string;
  food_types: string[];
  address: string;
  start_time: string;
  end_time: string;
  quantity: number | "";
  event_type?: string;
}

export default function CreateEventPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string>("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5002/api/user_role", {
          method: "GET",
          credentials: "include", 
        });

        if (response.ok) {
          const data = await response.json();
          setEventType(data.role); // Set the role as event type
        } else {
          console.error("Failed to fetch user role");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, []);

  const handleCreateEvent = async (newEvent: Event) => {
    try {
      const response = await fetch("http://127.0.0.1:5002/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage(
          `Event "${newEvent.title}" created successfully! Event ID: ${responseData.event_id}`
        );

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        console.error("Failed to create event");
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
        {message && <div className="feedback-message">{message}</div>}
        {eventType ? (
          <CreateEventForm onCreate={handleCreateEvent} eventType={eventType} />
        ) : (
          <p>Loading user role...</p>
        )}
      </div>
    </div>
  );
}