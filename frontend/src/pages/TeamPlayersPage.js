// frontend/src/pages/TeamPlayersPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';
import './TeamPlayersPage.css';

const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <h3>{player.name} #{player.number}</h3>
      <ul>
        <li><strong>Position:</strong> {player.position}</li>
        <li><strong>Throwing Hand:</strong> {player.throwingHand}</li>
        <li><strong>Batting Hand:</strong> {player.battingHand}</li>
        <li><strong>Batting Average:</strong> {player.stats.battingAverage.toFixed(3)}</li>
        <li><strong>Wins:</strong> {player.stats.wins}</li>
        <li><strong>Losses:</strong> {player.stats.losses}</li>
        <li><strong>ERA:</strong> {player.stats.era.toFixed(2)}</li>
        <li><strong>Strikeouts:</strong> {player.stats.strikeouts}</li>
      </ul>
    </div>
  );
};

const TeamPlayersPage = () => {
  const { teamId } = useParams();
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axiosInstance.get(`/api/teams/${teamId}/players`);
        setPlayers(response.data);
      } catch (error) {
        console.error('Failed to fetch players', error);
      }
    };

    const fetchTeamName = async () => {
      try {
        const response = await axiosInstance.get(`/api/teams/${teamId}`);
        setTeamName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch team name', error);
      }
    };

    fetchPlayers();
    fetchTeamName();
  }, [teamId]);

  return (
    <div className="team-players-page">
      <h2>{teamName} Team Players</h2>
      <div className="players-container">
        {players.map((player) => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default TeamPlayersPage;
