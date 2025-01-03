import React from "react";
import "@/app/styles/eventCard.css";
import "@/app/styles/rsvp-button.css"; // Import RSVP button styles
import FavoriteButton from "./favorite_button";
import RSVPButton from "./RSVPButton"; // Import RSVPButton
import { useRouter } from "next/navigation";

/**
 * EventCard Component
 *
 * Displays detailed information about a specific event.
 * 
 * Purpose:
 * - Showcases individual event details such as title, description, date, location, food type, and more.
 * - Allows users to mark events as favorites using the FavoriteButton component.
 * 
 * Usage:
 * - Used in the event listing or event details pages to display information about a single event.
 * - The 'event' prop provides the event details, and the 'userId' prop is used for user-specific functionality, such as favoriting events.
 *
 * Props:
 * - 'event': An object containing details about the event.
 * - 'userId': A numeric identifier for the currently logged-in user.
 * 
 * Styling:
 * - Custom styles are imported from 'eventCard.css'.
 * - The component is styled to clearly display event details in a card format.
 * 
 * Features:
 * - Displays all relevant details about an event.
 * - Includes a FavoriteButton component that allows users to mark events as favorites, with a success alert.
 * - Handles cases where event data is unavailable, displaying a fallback message.
 */


interface Event {
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  dietary_needs: string[];
  food_type: string;
  address: string;
  start_time: string;
  end_time: string;
  quantity: number;
}

interface EventCardProps {
  event: Event;
  userId: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, userId }) => {
  const router = useRouter();

  if (!event || Object.keys(event).length === 0) {
    return <div className="event-card">No event details available</div>;
  }

  const handleFavoriteSuccess = () => {
    alert(`Event "${event.title}" added to favorites!`);
  };

  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description}</p>
      <p className="event-date">
        <strong>Date:</strong> {event.event_date}
      </p>
      <p className="event-location">
        <strong>Location:</strong> {event.location}
      </p>
      <p className="event-food-type">
        <strong>Food Type:</strong>{" "}
        {event.dietary_needs && event.dietary_needs.length > 0
          ? event.dietary_needs.join(", ")
          : "None"}
      </p>
      <p className="event-address">
        <strong>Address:</strong> {event.address}
      </p>
      <p className="event-start-time">
        <strong>Start Time:</strong> {event.start_time}
      </p>
      <p className="event-end-time">
        <strong>End Time:</strong> {event.end_time}
      </p>
      <p className="event-quantity">
        <strong>Quantity:</strong> {event.quantity}
      </p>
  
      {/* RSVP and Favorite Buttons */}
      <div className="event-card-buttons">
        <RSVPButton eventId={event.event_id} />
        <FavoriteButton
          eventId={event.event_id}
          userId={userId}
          onFavoriteSuccess={handleFavoriteSuccess}
        />
      </div>
    </div>
  );
};

export default EventCard;


