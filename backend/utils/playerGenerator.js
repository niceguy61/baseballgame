const Player = require('../models/Player');

function getRandomName() {
  const firstNames = ['김', '이', '박', '최', '정'];
  const lastNames = ['민준', '서준', '예준', '도윤', '지후', '서윤', '하윤', '지민', '지윤', '예은'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName}${lastName}`;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 69) + 1;
}

function getRandomHand() {
  return Math.random() < 0.5 ? 'left' : 'right';
}

function getRandomStats() {
  return {
    strength: Math.floor(Math.random() * 19001) + 1000,
    intelligence: Math.floor(Math.random() * 19001) + 1000,
    mental: Math.floor(Math.random() * 19001) + 1000,
    agility: Math.floor(Math.random() * 19001) + 1000,
    battingAverage: parseFloat((Math.random() * 0.3 + 0.1).toFixed(3)),
    strikeouts: Math.floor(Math.random() * 300),
    wins: Math.floor(Math.random() * 20),
    losses: Math.floor(Math.random() * 20),
    era: parseFloat((Math.random() * 2 + 2).toFixed(2))
  };
}

async function createPlayer(name, position, teamId) {
  const player = new Player({
    name: name || getRandomName(),
    number: getRandomNumber(),
    throwingHand: getRandomHand(),
    battingHand: getRandomHand(),
    position,
    stats: getRandomStats(),
    team: teamId
  });

  return player.save();
}

async function generatePlayersForTeam(teamId) {
  const positions = ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Outfield'];
  const players = [];

  // 선발 투수 7명, 계투 5명, 마무리 2명 생성
  for (let i = 0; i < 7; i++) players.push(await createPlayer(null, 'Pitcher', teamId));
  for (let i = 0; i < 5; i++) players.push(await createPlayer(null, 'Pitcher', teamId));
  for (let i = 0; i < 2; i++) players.push(await createPlayer(null, 'Pitcher', teamId));

  // 야수 포지션별로 2명 생성
  positions.slice(1).forEach(async (position) => {
    players.push(await createPlayer(null, position, teamId));
    players.push(await createPlayer(null, position, teamId));
  });

  return players;
}

module.exports = {
  createPlayer,
  generatePlayersForTeam
};
