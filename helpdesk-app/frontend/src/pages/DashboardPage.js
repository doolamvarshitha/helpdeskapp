// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalTickets: 0, totalCustomers: 0 });

  // Fetch statistics (number of tickets and customers)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats"); // Assume you have an API route for fetching stats
        const data = await response.json();
        setStats({
          totalTickets: data.totalTickets,
          totalCustomers: data.totalCustomers,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Total Tickets: {stats.totalTickets}</h3>
        <h3>Total Customers: {stats.totalCustomers}</h3>
      </div>
    </div>
  );
};

export default DashboardPage;
