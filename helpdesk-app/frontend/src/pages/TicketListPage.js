// src/pages/TicketListPage.js

import React, { useState, useEffect } from 'react';

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);  // State to store ticket data
  const [loading, setLoading] = useState(true);  // Loading state to show spinner while fetching

  // useEffect hook to fetch tickets when the component mounts
  useEffect(() => {
    // Async function to fetch tickets from backend
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets");  // Call to backend API
        const data = await response.json();  // Parse the response as JSON
        setTickets(data);  // Store the tickets data in state
        setLoading(false);  // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching tickets:", error);  // Handle any errors
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchTickets();  // Call the function to fetch tickets
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;  // Show loading text while data is being fetched
  }

  return (
    <div>
      <h2>All Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Last Updated On</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{ticket._id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>{ticket.customer?.name}</td>
              <td>{new Date(ticket.lastUpdatedOn).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketListPage;
