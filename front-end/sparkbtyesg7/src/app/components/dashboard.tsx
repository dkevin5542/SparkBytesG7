import React from 'react';
import '@/app/styles/dashboard.css';
import CreateEventForm from './eventform';
import EventList from './eventlist';
import Navbar from './navbar';

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

