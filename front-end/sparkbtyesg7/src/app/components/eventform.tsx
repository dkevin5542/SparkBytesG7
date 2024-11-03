import React from 'react';
import '@/app/styles/eventform.css';



export const CreateEventForm = ({ onCreate }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, description, date, location });
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
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
