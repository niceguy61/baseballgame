import React, { useState, useEffect } from 'react';
import socketIoClient from 'socket.io-client';
import axiosInstance from '../axiosInstance';
import './GamePage.css';

const socket = socketIoClient('http://localhost:5000', {
  transports: ['websocket', 'polling']
});

const BaseDiamond = ({ bases }) => {
  const getBaseStyle = (occupied) => (occupied ? 'occupied' : 'empty');

  return (
    <div className="diamond">
      <div className={`base home`}>H</div>
      <div className={`base first ${getBaseStyle(bases.first)}`}>1B</div>
      <div className={`base second ${getBaseStyle(bases.second)}`}>2B</div>
      <div className={`base third ${getBaseStyle(bases.third)}`}>3B</div>
    </div>
  );
};

const PitcherStats = ({ pitcher }) => {
  return (
    <div className="pitcher-stats">
      <h3>Pitcher Stats</h3>
      <ul>
        <li><strong>Name:</strong> {pitcher.name}</li>
        <li><strong>Wins:</strong> {pitcher.stats.wins}</li>
        <li><strong>Losses:</strong> {pitcher.stats.losses}</li>
        <li><strong>ERA:</strong> {pitcher.stats.era.toFixed(2)}</li>
        <li><strong>Strikeouts:</strong> {pitcher.stats.strikeouts}</li>
        <li><strong>Total Pitches:</strong> {pitcher.totalPitches}</li>
      </ul>
    </div>
  );
};

const LineupTable = ({ lineup, title }) => {
  return (
    <div className="lineup-table">
      <h3>{title} Lineup</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Batting Average</th>
            <th>Strikeouts</th>
          </tr>
        </thead>
        <tbody>
          {lineup.map(player => (
            <tr>
              <td>{player.name}</td>
              <td>{player.position}</td>
              <td>{player.stats.battingAverage.toFixed(3)}</td>
              <td>{player.stats.strikeouts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Scoreboard = ({ game }) => {
  console.log(game)
  const innings = Array.from({ length: 9 }, (_, i) => i + 1);
  const getInningScore = (scores, inning) => scores[inning - 1] || '';

  return (
    <div className="scoreboard">
      <table>
        <thead>
          <tr>
            <th></th>
            {innings.map(inning => <th key={inning}>{inning}</th>)}
            <th>R</th>
            <th>H</th>
            <th>E</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{game.awayTeam}</td>
            {innings.map(inning => <td key={inning}>{game.inningScores.away[inning-1]}</td>)}
            <td>{game.scoreboard.away}</td>
            <td>{Math.floor(Math.random() * 10)}</td>
            <td>{Math.floor(Math.random() * 5)}</td>
          </tr>
          <tr>
            <td>{game.homeTeam}</td>
            {innings.map(inning => <td key={inning}>{game.inningScores.home[inning-1]}</td>)}
            <td>{game.scoreboard.home}</td>
            <td>{Math.floor(Math.random() * 10)}</td>
            <td>{Math.floor(Math.random() * 5)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const CountDisplay = ({ count, label, filledColor }) => {
  return (
    <div className="count">
      <span className={`count-circle ${count > 0 ? filledColor : 'empty-circle'}`}>{label}</span>
      <span className={`count-circle ${count > 1 ? filledColor : 'empty-circle'}`}>{label}</span>
      <span className={`count-circle ${count > 2 ? filledColor : 'empty-circle'}`}>{label}</span>
    </div>
  );
};

const GamePage = () => {
  const [game, setGame] = useState(null);
  const [homeLineup, setHomeLineup] = useState([]);
  const [awayLineup, setAwayLineup] = useState([]);
  const [currentPitcher, setCurrentPitcher] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axiosInstance.get('/api/games/current');
        setGame(response.data.game);
        setHomeLineup(response.data.homeLineup);
        setAwayLineup(response.data.awayLineup);
        setCurrentPitcher(response.data.currentPitcher);
      } catch (error) {
        console.error('Failed to fetch current game', error);
      }
    };
    fetchGame();

    socket.on('gameUpdate', (updatedGame) => {
      setGame(updatedGame);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  if (!game) return <div>No ongoing game found</div>;

  return (
    <div className="game-page">
      <h2>Game Status</h2>
      <Scoreboard game={game} />
      {currentPitcher && <PitcherStats pitcher={currentPitcher} />}
      <div className="counts">
        <div className="count-label">B</div>
        <CountDisplay count={game.ballCount} label="B" filledColor="green-circle" />
        <div className="count-label">S</div>
        <CountDisplay count={game.strikeCount} label="S" filledColor="yellow-circle" />
        <div className="count-label">O</div>
        <CountDisplay count={game.outCount} label="O" filledColor="red-circle" />
      </div>
      <h3>Base Status</h3>
      <BaseDiamond bases={game.bases} />
      <LineupTable lineup={homeLineup} title="Home" />
      <LineupTable lineup={awayLineup} title="Away" />
      <ul>
        {game.logs.slice().reverse().map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default GamePage;
