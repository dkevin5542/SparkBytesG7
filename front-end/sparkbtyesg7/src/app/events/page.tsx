"use client";

import React, { useEffect, useState } from 'react';
import EventList from '../components/eventlist';  
import Layout from '../layout';   
import '@/app/styles/page.css';  

/**
 * EventsPage Component
 *
 * Fetches and displays a list of events from the backend API.
 * Uses client-side rendering and manages its own loading and error states.
 *
 * Purpose:
 * - Fetches events from the backend and displays them in a list.
 * - Handles loading and error states during the fetching process.
 *
 * Features:
 * - Displays all available events fetched from the API.
 * - Shows a loading message while fetching.
 * - Shows an error message if the fetching process fails.
 * - Uses the Layout component to wrap the page content for consistent styling.
 */

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);  

    // Fetch events from the backend
    const fetchEvents = async () => {
        try {
        const response = await fetch('http://localhost:5002/api/events');
        if (response.ok) {
            const data = await response.json();
            setEvents(data.events); 
        } else {
            setError('Failed to fetch events');  
        }
        } catch (err) {
        setError('Error fetching events');  
        } finally {
        setLoading(false);
        }
    };

    // Runs once on component mount to fetch the events
    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="events-page"><p>Loading events...</p></div>;
    }

    if (error) {
        return <div className="events-page"><p>{error}</p></div>;
    }

    return (
        <Layout>
        <div className="events-page">
            <h1>All Events</h1>
            {events.length > 0 ? (
            <EventList events={events} />
            ) : (
            <p>No events available. Check back later!</p>
            )}
        </div>
        </Layout>
    );
};

export default EventsPage;