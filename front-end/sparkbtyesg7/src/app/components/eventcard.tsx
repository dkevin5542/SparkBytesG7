import React from "react";
import "@/app/styles/eventCard.css";
import FavoriteButton from "./favorite_button";

interface Event {
  event_id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  food_type: string;
  address: string;
  start_time: string;
  end_time: string;
  quantity: number;
  event_type: string;
}

interface EventCardProps {
  event: Event;
  userId: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, userId }) => {
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
        <strong>Date:</strong> {event.date}
      </p>
      <p className="event-id">
        <strong>Event ID:</strong> {event.event_id}
      </p>
      <p className="event-location">
        <strong>Location:</strong> {event.location}
      </p>
      <p className="event-food-type">
        <strong>Food Type:</strong> {event.food_type}
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
      <p className="event-type">
        <strong>Event Type:</strong> {event.event_type}
      </p>

      {/* Favorite Button */}
      <FavoriteButton
        eventId={event.event_id}
        userId={userId}
        onFavoriteSuccess={handleFavoriteSuccess}
      />
    </div>
  );
};

export default EventCard;

