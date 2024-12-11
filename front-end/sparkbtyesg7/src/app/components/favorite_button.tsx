"use client";

import React, { useState } from "react";
import "@/app/styles/favorite-button.css";

/**
 * FavoriteButton Component
 *
 * A button component that allows users to add an event to their favorites.
 * 
 * Purpose:
 * - Sends a request to add a specific event to the user's favorites list.
 * - Handles server responses, including success, duplicate errors, bad requests, and generic errors.
 * 
 * Usage:
 * - Placed within an event card or details component where users can mark events as favorites.
 * - Requires the event ID, user ID, and a callback for success handling to be passed as props.
 * 
 * Props:
 * - 'eventId': The unique identifier of the event to be added to favorites.
 * - 'userId': The unique identifier of the user adding the event to favorites.
 * - 'onFavoriteSuccess': A callback function invoked when the event is successfully added to favorites.
 * 
 * Features:
 * - Makes a POST request to the API endpoint to add the event to favorites.
 * - Provides user feedback on success or error using alerts and logs.
 * - Handles different response statuses.
 * - Displays a fallback error message for unexpected issues.
 */

interface FavoriteButtonProps {
  eventId: number;
  userId: number;
  onFavoriteSuccess: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  eventId,
  userId,
  onFavoriteSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFavorite = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5002/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id: eventId }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to favorites.");
      }

      onFavoriteSuccess();
    } catch (err: any) {
      console.error("Error favoriting event:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="favorite-button-container">
      <button
        onClick={handleFavorite}
        disabled={loading}
        aria-busy={loading}
        aria-label="Add event to favorites"
      >
        {loading ? "Adding..." : "Add to Favorites"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FavoriteButton;

