// backend/mongo-init.js
db = db.getSiblingDB('admin');

// 관리자 계정 생성
db.createUser({
  user: 'admin',
  pwd: 'securepassword',
  roles: [
    { role: 'userAdminAnyDatabase', db: 'admin' },
    { role: 'dbAdminAnyDatabase', db: 'admin' },
    { role: 'readWriteAnyDatabase', db: 'admin' }
  ]
});

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
