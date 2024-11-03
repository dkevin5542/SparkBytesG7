import React from 'react';
import '@/app/styles/eventCard.css';

export const EventCard = ({ event = {} }) => {
  if (!event || Object.keys(event).length === 0) {
    return <div className="event-card">No event details available</div>;
  }

  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description}</p>
      <p className="event-date">Date: {event.date}</p>
      <p className="event-location">Location: {event.location}</p>
    </div>
  );
};

export default EventCard;