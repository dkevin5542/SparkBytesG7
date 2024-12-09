"use client";

import React from "react";

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
  eventId: number; // ID of the event to be favorited
  userId: number;  // ID of the user adding the favorite
  onFavoriteSuccess: () => void; // Callback for successful addition
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ eventId, userId, onFavoriteSuccess }) => {
   // Handles the favorite button click
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
      // Handle unexpected errors
      console.error("Error favoriting event:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return <button onClick={handleFavorite}>Add to Favorites</button>;
};

export default FavoriteButton;