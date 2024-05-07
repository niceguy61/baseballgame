import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './PreviousGamePage.css';

const PlayerStatsTable = ({ stats, title }) => {
  return (
    <div className="player-stats-table">
      <h3>{title} Stats</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>At Bats</th>
            <th>Hits</th>
            <th>Walks</th>
            <th>Strikeouts</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.player.name}</td>
              <td>{stat.atBats}</td>
              <td>{stat.hits}</td>
              <td>{stat.walks}</td>
              <td>{stat.strikeouts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EventLogs = ({ events }) => {
  return (
    <div className="event-logs">
      <h3>Event Logs</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {`Inning ${event.inning}, Out ${event.outCount}: ${event.eventType} by ${event.player.name}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PreviousGamePage = () => {
  const [previousGame, setPreviousGame] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchPreviousGame = async () => {
      try {
        const response = await axiosInstance.get('/api/games/previous');
        setPreviousGame(response.data.game);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Failed to fetch previous game', error);
      }
    };
    fetchPreviousGame();
  }, []);

  if (!previousGame) return <div>No previous game found</div>;

  return (
    <div className="previous-game-page">
      <h2>Previous Game Result</h2>
      <table className="scoreboard">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: 9 }, (_, i) => <th key={i}>{i + 1}</th>)}
            <th>R</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{previousGame.awayTeam}</td>
            {previousGame.inningScores.away.map((score, index) => <td key={index}>{score}</td>)}
            <td>{previousGame.scoreboard.away}</td>
          </tr>
          <tr>
            <td>{previousGame.homeTeam}</td>
            {previousGame.inningScores.home.map((score, index) => <td key={index}>{score}</td>)}
            <td>{previousGame.scoreboard.home}</td>
          </tr>
        </tbody>
      </table>
      <PlayerStatsTable stats={previousGame.playerStats.away} title={previousGame.awayTeam} />
      <PlayerStatsTable stats={previousGame.playerStats.home} title={previousGame.homeTeam} />
      <EventLogs events={events} />
    </div>
  );
};

export default PreviousGamePage;
