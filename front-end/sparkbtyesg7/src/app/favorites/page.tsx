"use client";

import React, { useEffect, useState } from "react";

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

