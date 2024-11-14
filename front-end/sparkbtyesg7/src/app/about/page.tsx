/* Importing React and global CSS styles. */
import React from 'react';
import '@/app/styles/about.css';
/**
 * About Component
 *
 * Displays the "About Us" section of the Spark Bytes application.
 * 
 * Purpose:
 * - Explains how Spark Bytes helps Boston University students find free food at campus events.
 * - Describes Spark Byte's mission to reduce food waste.
 * 
 * Usage:
 * Placed on the "About" page of the application, providing information about its mission and functionality.
 *
 * Styling:
 * - Inline styles are used for padding.
 * - Global CSS is imported for overall styling consistency.
 */

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          Spark Bytes connects Boston University students with free food at campus events while helping reduce food waste.
          Faculty can post event details like food type, location, and time, allowing students to RSVP and plan their attendance.
          Our goal is to create a sustainable, community-driven solution that benefits both students and the environment.
        </p>
      </div>
    </div>
  );
};

export default About;