import React from 'react';
import '@/app/styles/eventform.css';

export const CreateEventForm = () => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const eventData = {
        title,
        description,
        date,
        location
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/events', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
        console.error("Error creating event:", error);
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
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Event Location"
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
};
export default CreateEventForm;
