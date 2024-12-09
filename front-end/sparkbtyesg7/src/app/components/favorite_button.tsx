"use client";

import React, { useState } from "react";

interface FavoriteButtonProps {
  eventId: number;
  userId: number;
  onFavoriteSuccess: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ eventId, userId, onFavoriteSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5002/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, event_id: eventId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); 
        onFavoriteSuccess();
      } else if (response.status === 409) {
        alert("Event is already in favorites.");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to favorite event.");
      }
    } catch (error) {
      console.error("Error favoriting event:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label="Add event to favorites"
    >
      {isLoading ? "Adding..." : "Add to Favorites"}
    </button>
  );
};

export default FavoriteButton;

