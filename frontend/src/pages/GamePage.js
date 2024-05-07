// frontend/src/pages/GamePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIo from 'socket.io-client';

const socket = socketIo('http://localhost:5000');

const GamePage = () => {
    const [game, setGame] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            const response = await axios.get('/api/games/current', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setGame(response.data);
        };
        fetchGame();

        socket.on('gameUpdate', (updatedGame) => {
            setGame(updatedGame);
        });

        return () => {
            socket.off('gameUpdate');
        };
    }, []);

    if (!game) return <div>Loading...</div>;

    return (
        <div>
            <h2>Game Page</h2>
            <div>
                <strong>Scoreboard:</strong>
                {game.homeTeam} {game.scoreboard.home} - {game.awayTeam} {game.scoreboard.away}
            </div>
            <div>
                <strong>Out Count:</strong> {game.outCount}
            </div>
            <div>
                <strong>Inning:</strong> {game.inning}
            </div>
            <ul>
                {game.logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
};

export default GamePage;
