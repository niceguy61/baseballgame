const Game = require('../models/Game');
const Event = require('../models/Event');

function getRandomInterval(min = 10, max = 30) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEvent() {
  const events = [
    'Single', 'Double', 'Triple', 'Home Run',
    'Strike Out', 'Walk', 'Hit By Pitch', 'Ground Out', 'Fly Out'
  ];
  return events[Math.floor(Math.random() * events.length)];
}

async function updateBases(bases, event) {
  switch (event) {
    case 'Single':
      if (bases.third) {
        bases.third = false;
      } else if (bases.second) {
        bases.second = false;
        bases.third = true;
      } else if (bases.first) {
        bases.first = false;
        bases.second = true;
      }
      bases.first = true;
      break;

    case 'Double':
      bases.third = bases.second = bases.first = false;
      bases.second = true;
      bases.third = true;
      break;

    case 'Triple':
      bases.third = bases.second = bases.first = false;
      bases.third = true;
      break;

    case 'Home Run':
      bases.third = bases.second = bases.first = false;
      break;

    case 'Walk':
    case 'Hit By Pitch':
      if (!bases.first) {
        bases.first = true;
      } else if (!bases.second) {
        bases.second = true;
      } else if (!bases.third) {
        bases.third = true;
      }
      break;

    default:
      break;
  }

  return bases;
}

function initializeInningScores(scores, inning) {
  while (scores.length < inning) {
    scores.push(0);
  }
}

async function generateEvent(io) {
  const ongoingGame = await Game.findOne({ status: 'ongoing' }).populate('lineup.home').populate('lineup.away');
  if (!ongoingGame) return;

  const isHomeTeam = Math.random() < 0.5;
  const team = isHomeTeam ? 'home' : 'away';
  const lineup = ongoingGame.lineup[team];
  const player = lineup[Math.floor(Math.random() * lineup.length)];

  const event = getRandomEvent();
  const eventRecord = new Event({
    game: ongoingGame._id,
    team,
    player: player._id,
    eventType: event,
    inning: ongoingGame.inning,
    outCount: ongoingGame.outCount,
    ballCount: ongoingGame.ballCount,
    strikeCount: ongoingGame.strikeCount,
    bases: { ...ongoingGame.bases }
  });

  await eventRecord.save();

  initializeInningScores(ongoingGame.inningScores.home, ongoingGame.inning);
  initializeInningScores(ongoingGame.inningScores.away, ongoingGame.inning);

  if (['Strike Out', 'Ground Out', 'Fly Out'].includes(event)) {
    ongoingGame.strikeCount = 0;
    ongoingGame.ballCount = 0;
    ongoingGame.outCount = (ongoingGame.outCount + 1) % 3;

    if (ongoingGame.outCount === 0) {
      ongoingGame.inning += 1;
      initializeInningScores(ongoingGame.inningScores.home, ongoingGame.inning);
      initializeInningScores(ongoingGame.inningScores.away, ongoingGame.inning);
    }
  } else if (['Single', 'Double', 'Triple', 'Home Run'].includes(event)) {
    ongoingGame.bases = await updateBases(ongoingGame.bases, event);
    ongoingGame.strikeCount = 0;
    ongoingGame.ballCount = 0;

    ongoingGame.scoreboard[team] += 1;
    ongoingGame.inningScores[team][ongoingGame.inning - 1] += 1;
  } else if (event === 'Walk' || event === 'Hit By Pitch') {
    ongoingGame.bases = await updateBases(ongoingGame.bases, event);
    ongoingGame.strikeCount = 0;
    ongoingGame.ballCount = 0;
  } else {
    ongoingGame.strikeCount = (ongoingGame.strikeCount + 1) % 3;
    ongoingGame.ballCount = (ongoingGame.ballCount + 1) % 4;
  }

  if (ongoingGame.inning > 9) {
    ongoingGame.status = 'finished';
  }

  await ongoingGame.save();
  io.emit('gameUpdate', ongoingGame);

  const interval = getRandomInterval() * 1000;
  setTimeout(() => generateEvent(io), interval);
}

module.exports = {
  generateEvent
};
