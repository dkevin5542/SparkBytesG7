import React from 'react';
import '@/app/styles/eventCard.css';

export const EventCard = ({ event }) => {
  if (!event || Object.keys(event).length === 0) {
    return <div className="event-card">No event details available</div>;
  }

  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description}</p>
      <p className="event-date"><strong>Date:</strong> {event.date}</p>
      <p className="event-id"><strong>Event ID:</strong> {event.event_id}</p>
      <p className="event-location"><strong>Location:</strong> {event.location}</p>
      <p className="event-food-type"><strong>Food Type:</strong> {event.food_type}</p>
      <p className="event-address"><strong>Address:</strong> {event.address}</p>
      <p className="event-start-time"><strong>Start Time:</strong> {event.start_time}</p>
      <p className="event-end-time"><strong>End Time:</strong> {event.end_time}</p>
      <p className="event-quantity"><strong>Quantity:</strong> {event.quantity}</p>
      <p className="event-type"><strong>Event Type:</strong> {event.event_type}</p>
    </div>
  );
};

export default EventCard;
