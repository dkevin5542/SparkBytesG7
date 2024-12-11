"use client";

import React, { useState } from "react";
import "@/app/styles/favorite-button.css";

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

