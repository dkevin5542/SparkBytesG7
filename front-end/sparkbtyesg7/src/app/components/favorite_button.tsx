"use client";

import React from "react";

interface FavoriteButtonProps {
  eventId: number;
  userId: number;
  onFavoriteSuccess: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ eventId, userId, onFavoriteSuccess }) => {
  const handleFavorite = async () => {
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
        console.log(data.message); // Event added to bookmarks
        onFavoriteSuccess();
      } else if (response.status === 409) {
        // Handle duplicate favorite error
        alert("Event is already in favorites.");
      } else if (response.status === 400) {
        // Handle bad request error
        const errorData = await response.json();
        alert(errorData.error || "Invalid request.");
      } else {
        // Handle generic error
        const errorData = await response.json();
        console.error("Failed to favorite event:", errorData.error || "Unknown error");
        alert(errorData.error || "Failed to favorite event.");
      }
    } catch (error) {
      console.error("Error favoriting event:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return <button onClick={handleFavorite}>Add to Favorites</button>;
};

export default FavoriteButton;

