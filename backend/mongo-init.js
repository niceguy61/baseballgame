db = db.getSiblingDB('baseball-game');

// 팀 컬렉션에 초기 데이터 추가
db.teams.insertMany([
  {
    name: 'Team A',
    emblem: 'KBO',
    players: [
      { name: 'Pitcher A1', position: 'Pitcher' },
      { name: 'Batter A1', position: 'Batter' },
      { name: 'Batter A2', position: 'Batter' }
    ]
  },
  {
    name: 'Team B',
    emblem: 'KBO',
    players: [
      { name: 'Pitcher B1', position: 'Pitcher' },
      { name: 'Batter B1', position: 'Batter' },
      { name: 'Batter B2', position: 'Batter' }
    ]
  }
]);

// 사용자 컬렉션에 초기 관리자 계정 추가
db.users.insertOne({
  username: 'admin',
  hash: '$2a$10$EhhV.rO3w/RR9qumy6UBv.widIHeU2V.Ln5bvYFu5JXQ/fi3O.g0a', // "admin"의 해시된 비밀번호
  salt: '$2a$10$EhhV.rO3w/RR9qumy6UBv.',
  isAdmin: true
});

// 게임 컬렉션에 초기 데이터 추가
db.games.insertMany([
  {
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    scoreboard: {
      home: 5,
      away: 3
    },
    inning: 9,
    outCount: 2,
    status: 'ongoing',
    logs: [
      'Inning 1: Team A scores 1 run',
      'Inning 2: Team B scores 2 runs',
      'Inning 5: Team A scores 3 runs',
      'Inning 8: Team A scores 1 run',
      'Inning 9: Team B scores 1 run'
    ]
  },
  {
    homeTeam: 'Team C',
    awayTeam: 'Team D',
    scoreboard: {
      home: 2,
      away: 1
    },
    inning: 3,
    outCount: 1,
    status: 'scheduled',
    logs: [
      'Inning 1: Team C scores 1 run',
      'Inning 2: Team D scores 1 run',
      'Inning 3: Team C scores 1 run'
    ]
  }
]);
