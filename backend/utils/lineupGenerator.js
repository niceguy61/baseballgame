const Player = require('../models/Player');

async function generateLineup(teamId) {
  const positions = ['Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Outfield', 'Outfield', 'Outfield'];
  const lineup = [];

  // 타순 생성
  for (const position of positions) {
    const players = await Player.find({ team: teamId, position });
    lineup.push(players[Math.floor(Math.random() * players.length)]);
  }

  // 투수 추가
  const pitchers = await Player.find({ team: teamId, position: 'Pitcher' });
  lineup.push(pitchers[Math.floor(Math.random() * pitchers.length)]);

  return lineup;
}

module.exports = {
  generateLineup
};
