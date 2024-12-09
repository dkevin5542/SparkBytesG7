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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null); 

    try {
      const response = await fetch('http://localhost:5002/favorites', {
        method: "GET",
        credentials: "include",
      });

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

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
    <div>
      <h1>Your Favorite Events</h1>
      {favorites.length === 0 ? (
        <p>No favorite events found.</p>
      ) : (
        <ul>
          {favorites.map((event) => (
            <li key={event.event_id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;

