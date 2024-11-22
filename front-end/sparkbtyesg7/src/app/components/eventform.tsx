import React from 'react';
import '@/app/styles/eventform.css';


export const CreateEventForm = ({ onCreate }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState('');
  const [eventId, setEventId] = React.useState<number | ''>('');
  const [location, setLocation] = React.useState('');
  const [foodType, setFoodType] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [quantity, setQuantity] = React.useState<number | ''>('');
  const [eventType, setEventType] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      date,
      event_id: eventId,
      location,
      food_type: foodType,
      address,
      start_time: startTime,
      end_time: endTime,
      quantity,
      event_type: eventType,
    };

    try {
      const response = await fetch('http://127.0.0.1:5002/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        // Clear form fields
        setTitle('');
        setDescription('');
        setDate('');
        setEventId('');
        setLocation('');
        setFoodType('');
        setAddress('');
        setStartTime('');
        setEndTime('');
        setQuantity('');
        setEventType('');

        // Notify parent component of new event
        onCreate(eventData);
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-event-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Event Description"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        value={eventId}
        onChange={(e) => setEventId(Number(e.target.value))}
        placeholder="Event ID"
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Event Location"
        required
      />
      <input
        type="text"
        value={foodType}
        onChange={(e) => setFoodType(e.target.value)}
        placeholder="Food Type"
        required
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        required
      />
      <label htmlFor="start-time">Start Time</label>
      <input
        id="start-time"
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <label htmlFor="end-time">End Time</label>
      <input
        id="end-time"
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
        required
      />
      <input
        type="text"
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        placeholder="Event Type"
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEventForm;