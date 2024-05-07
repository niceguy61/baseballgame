// frontend/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            const response = await axios.get('/api/games', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setGames(response.data);
        };
        fetchGames();
    }, []);

    return (
        <div>
            <h2>Admin Page</h2>
            <ul>
                {games.map((game) => (
                    <li key={game._id}>
                        {game.homeTeam} vs {game.awayTeam} - {game.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
