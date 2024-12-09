"use client";

/* Importing React and global CSS styles. */
import React, { useState, useEffect } from 'react';
import '@/app/styles/eventform.css';

/**
 * CreateEventForm Component
 *
 * A form for creating new events in the Spark Bytes application.
 * 
 * Purpose:
 * - Allows users to input details for a new event, such as title, description, date, location, food types, and more.
 * - Handles form submission and passes the event data to the parent component via the 'onCreate' callback.
 * 
 * Usage:
 * - Used on event creation page to enable users to create events.
 * - The 'onCreate' prop accepts a function to handle the submission of event data.
 * - The 'eventType' prop auto-fills the event type field.
 *
 * Props:
 * - 'onCreate: A function called when the form is submitted, passing the event data as a parameter.
 * - 'eventType': A string used to auto-fill the event type field, providing consistency for event categorization.
 * 
 * Features:
 * - Form fields for capturing event details:
 *   - 'title', 'description', 'date', 'location', 'address', 'start_time', 'end_time', 'quantity', and 'food_types'.
 * - Dynamically handles food type selections using checkboxes.
 * - Resets form fields after successful submission.
 * 
 * Styling:
 * - Custom styles are imported from 'eventform.css'.
 * - Includes a user-friendly layout with labels, placeholders, and interactive elements.
 *
 * Behavior:
 * - Prevents default form submission using 'e.preventDefault()'.
 * - Validates required fields to ensure all necessary data is provided.
 * - Converts empty 'quantity' to 0 for consistent data handling.
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
  user_id?: string;
}

interface CreateEventFormProps {
  onCreate: (event: Event) => void;
  eventType: string; // Added for auto-filling the event type
}

// List of food options for checkboxes
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

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ onCreate, eventType }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');

  // Handles selection of food type checkboxes
  const handleFoodTypeChange = (option: string) => {
    setFoodTypes((prev) =>
      prev.includes(option) ? prev.filter((type) => type !== option) : [...prev, option]
    );
  };

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct event data object
    const eventData: Event = {
      title,
      description,
      date,
      location,
      food_types: foodTypes,
      address,
      start_time: startTime,
      end_time: endTime,
      quantity: quantity === '' ? 0 : Number(quantity),
      event_type: eventType, // Automatically filled
    };

    // Pass event data to parent component
    onCreate(eventData);

    // Reset form fields
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setFoodTypes([]);
    setAddress('');
    setStartTime('');
    setEndTime('');
    setQuantity('');
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
      <div className="food-type-container">
        <label className="food-type-label">Food Type</label>
        <div className="food-type-options">
          {foodOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={foodTypes.includes(option)}
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
        placeholder="Event Type"
        readOnly
        disabled
      />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEventForm;
