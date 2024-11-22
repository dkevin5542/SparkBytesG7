"use client";

import React, { useState } from 'react';
import '@/app/styles/eventform.css';

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

interface CreateEventFormProps {
  onCreate: (event: Event) => void;
}

const foodOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Soy-Free",
  "Halal",
  "Kosher",
  "Snacks",
  "Other",
];

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [eventId, setEventId] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [foodType, setFoodType] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [eventType, setEventType] = useState('');

  const handleFoodTypeChange = (option: string) => {
    if (foodType.includes(option)) {
      // Remove the option if it is already selected
      setFoodType(foodType.filter((type) => type !== option));
    } else {
      // Add the option if it is not selected
      setFoodType([...foodType, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData: Event = {
      title,
      description,
      date,
      event_id: eventId === '' ? '' : Number(eventId),
      location,
      food_type: foodType,
      address,
      start_time: startTime,
      end_time: endTime,
      quantity: quantity === '' ? '' : Number(quantity),
      event_type: eventType,
    };

    // Pass the new event data to the parent component
    onCreate(eventData);

    // Clear form fields
    setTitle('');
    setDescription('');
    setDate('');
    setEventId('');
    setLocation('');
    setFoodType([]);
    setAddress('');
    setStartTime('');
    setEndTime('');
    setQuantity('');
    setEventType('');
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
        <div className="food-type-container">
          <label className="food-type-label">Food Type</label>
          <div className="food-type-options">
            {foodOptions.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={foodType.includes(option)}
                  onChange={() => handleFoodTypeChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
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

/*
export default CreateEventForm;
export const CreateEventForm = ({ onCreate }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState('');
  const [eventId, setEventId] = React.useState<number | ''>('');
  const [location, setLocation] = React.useState('');
  const [foodType, setFoodType] = React.useState<string[]>([]);
  const [address, setAddress] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [quantity, setQuantity] = React.useState<number | ''>('');
  const [eventType, setEventType] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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

        onCreate(eventData);

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

  const handleFoodTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFoodType(selectedOptions);
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
      <label htmlFor="food-type">Food Type</label>
      <select
        id="food-type"
        multiple
        value={foodType}
        onChange={handleFoodTypeChange}
        required
      >
        {foodOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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

export default CreateEventForm;*/