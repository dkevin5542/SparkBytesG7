"use client";

import React, { useEffect, useState } from "react";

interface FavoriteEvent {
  event_id: number;
  title: string;
  date: string;
  location: string;
}

const FavoritesPage: React.FC<{ userId: number }> = ({ userId }) => {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

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
