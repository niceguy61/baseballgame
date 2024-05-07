import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Player</th>
            <th>Games Played</th>
            <th>Hits</th>
            <th>Home Runs</th>
            <th>RBIs</th>
            <th>Strikeouts</th>
            <th>Walks</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.team}</td>
              <td>{stat.player}</td>
              <td>{stat.gamesPlayed}</td>
              <td>{stat.hits}</td>
              <td>{stat.homeRuns}</td>
              <td>{stat.rbis}</td>
              <td>{stat.strikeouts}</td>
              <td>{stat.walks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsPage;
