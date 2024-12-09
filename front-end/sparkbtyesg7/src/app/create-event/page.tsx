"use client"; // Using client-side features in Next.js
/* Importing React and global CSS styles. */
import React, { useState, useEffect } from "react";
import CreateEventForm from "../components/eventform";
import '@/app/styles/formpage.css';

/**
 * CreateEventPage Component
 *
 * Provides a page for users to create new events.
 * 
 * Purpose:
 * - Displays a form for creating events, using the 'CreateEventForm' component.
 * - Dynamically retrieves the user's role to set the event type.
 * - Shows feedback messages when events are successfully created or when errors occur.
 * 
 * Features:
 * - Fetches the user's role from the backend and uses it to pre-fill the event type.
 * - Handles event creation by sending a POST request to the backend.
 * - Displays a temporary success message when an event is successfully added.
 * - Automatically clears feedback messages after 3 seconds.
 * 
 * State:
 * - 'message': A string or null value to store temporary feedback messages.
 * - 'eventType': A string representing the user's role, used to pre-fill the event type.
 * 
 * Functions:
 * - 'fetchRole': Fetches the user's role from the backend and sets the 'eventType' state.
 * - 'handleCreateEvent': Sends event data to the backend, handles the response, and displays a feedback message.
 * 
 * Usage:
 * - Included in the application to provide a dedicated event creation page.
 * - Automatically retrieves and sets up the user's role on page load.
 * 
 * Styling:
 * - Uses custom styles from 'formpage.css' for layout and design.
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

  // Retrieves the user's role when the component initializes
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

  // Handles event creation by sending a POST request to the backend
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