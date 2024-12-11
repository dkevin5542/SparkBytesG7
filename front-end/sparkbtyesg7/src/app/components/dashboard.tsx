import React from 'react';
import '@/app/styles/dashboard.css';
import CreateEventForm from './eventform';
import EventList from './eventlist';
import Navbar from './navbar';

/**
 * Dashboard Component
 *
 * Displays the main event interface for the Spark Bytes application.
 * 
 * Purpose:
 * - Provides a centralized dashboard for users to manage and view events.
 * - Allows users to create new events and browse the existing ones.
 * 
 * Usage:
 * Placed on the dashboard page of the application. 
 *
 * Props:
 * - 'events': An array of event objects to be displayed in the EventList component.
 * - 'onCreate': Invoked when a new event is created in the CreateEventForm.
 * 
 * Styling:
 * - Uses 'dashboard.css'.
 * - Includes a title, navigation bar, form, and event list styled for visual consistency.
 */

export const Dashboard = ({ events, onCreate }) => {
  return (
    <div className="dashboard">
      <Navbar />
      <h2 className="dashboard-title">Event Dashboard</h2>
      <CreateEventForm onCreate={onCreate} />
      <EventList events={events} />
    </div>
  );
};

export default Dashboard;

