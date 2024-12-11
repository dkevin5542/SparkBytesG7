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
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  address: string;
  quantity: number;
  dietary_needs: string[];
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5002/favorites", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch favorite events");
        } else {
          setError("Unexpected response from the server");
        }
        return;
      }

      const data = await response.json();
      if (data.success) {
        setFavorites(data.events);
      } else {
        setError(data.message || "Failed to fetch favorite events");
      }
    } catch (error) {
      setError("An error occurred while fetching favorite events");
      console.error("Error fetching favorite events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (isLoading) {
    return <div>Loading your favorite events...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchFavorites}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Your Favorite Events</h1>
      {favorites.length === 0 ? (
        <p>No favorite events found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favorites.map((event) => (
            <li
              key={event.event_id}
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "15px",
                paddingBottom: "15px",
              }}
            >
              <h3 style={{ margin: "0 0 5px" }}>{event.title}</h3>
              <p style={{ margin: "0" }}>
                <strong>Date:</strong> {event.event_date}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Time:</strong> {event.start_time} - {event.end_time}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Location:</strong> {event.location}, {event.address}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Quantity:</strong> {event.quantity}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Dietary Needs:</strong>{" "}
                {event.dietary_needs.length > 0
                  ? event.dietary_needs.join(", ")
                  : "None"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;

