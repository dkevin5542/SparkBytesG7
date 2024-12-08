"use client";

import React, { useEffect, useState } from "react";

/**
 * FavoritesPage Component
 *
 * Displays a list of events that the user has marked as favorites.
 * 
 * Purpose:
 * - Retrieves and displays the user's favorite events from the backend.
 * 
 * Features:
 * - Fetches the user's favorite events using their user ID.
 * - Handles API responses, including unexpected errors and non-JSON responses.
 * - Displays a message if no favorite events are found.
 * - Shows an error message if fetching favorites fails.
 * 
 * Props:
 * - 'userId': A number representing the user's unique identifier.
 * 
 * State:
 * - 'favorites': An array of favorite events fetched from the backend.
 * - 'error': A string or null to store error messages during API calls.
 * 
 * Functions:
 * - 'fetchFavorites': Fetches the list of favorite events for the user from the backend.
 * 
 * Usage:
 * - Used in the application to display the user's favorite events on a dedicated page.
 * - Requires a backend API endpoint to handle favorite event retrieval.
 */

interface FavoriteEvent {
  event_id: number; // Unique identifier for the event
  title: string; // Title of the event
  date: string; // Date of the event
  location: string; // Location of the event
}

const FavoritesPage: React.FC<{ userId: number }> = ({ userId }) => {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetches the user's favorite events 
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5002/api/favorites/${userId}`, {
          method: "GET",
        });
  
        // Handle non-JSON responses
        if (!response.ok) {
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            setError(errorData.error || "Failed to fetch favorites");
          } else {
            setError("Unexpected response from the server");
          }
          return;
        }
  
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        setError("An error occurred while fetching favorites");
        console.error("Error fetching favorites:", error);
      }
    };
  
    fetchFavorites();
  }, [userId]);

  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Favorite Events</h1>
      {favorites.length === 0 ? (
        <p>No favorite events found.</p>
      ) : (
        <ul>
        {favorites.map((event) => (
          <li key={event.event_id}>
            <h3>{event.title}</h3>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
          </li>
        ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;