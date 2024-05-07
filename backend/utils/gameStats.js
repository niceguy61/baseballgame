const Game = require('../models/Game');

async function updatePlayerStats(gameId, team, playerId, result) {
  const game = await Game.findById(gameId);
  if (!game) return;

  const stats = game.playerStats[team].find(s => s.player.equals(playerId));
  if (!stats) return;

  stats.atBats += 1;

  switch (result) {
    case 'hit':
      stats.hits += 1;
      break;
    case 'walk':
      stats.walks += 1;
      break;
    case 'strikeout':
      stats.strikeouts += 1;
      break;
    default:
      break;
  }

  await game.save();
}

async function initializePlayerStats(game) {
  const homeLineupStats = game.lineup.home.map(player => ({
    player: player._id,
    atBats: 0,
    hits: 0,
    walks: 0,
    strikeouts: 0
  }));
  const awayLineupStats = game.lineup.away.map(player => ({
    player: player._id,
    atBats: 0,
    hits: 0,
    walks: 0,
    strikeouts: 0
  }));

  game.playerStats = {
    home: homeLineupStats,
    away: awayLineupStats
  };

  await game.save();
}

module.exports = {
  updatePlayerStats,
  initializePlayerStats
};
