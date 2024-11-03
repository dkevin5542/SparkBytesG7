"use client";
import React, { useState } from 'react';
import Navbar from "./components/navbar";
import EventList from "./components/eventlist";
import '@/app/styles/page.css';

export default function Home() {
  const [events, setEvents] = useState([
    { title: "Event 1", description: "Description 1", date: "2024-12-01", location: "Location 1" },
    { title: "Event 2", description: "Description 2", date: "2024-12-02", location: "Location 2" }
  ]);

  return (
    <div className="home-page">
      <Navbar />
      <div className="content">
        <EventList events={events} />
      </div>
    </div>
  );
}